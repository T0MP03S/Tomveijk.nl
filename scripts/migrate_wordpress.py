"""
WordPress → tomveijk.nl Migratie Script v2
============================================
Haalt alle posts, pagina's, EN custom post types (Avada Portfolio)
op van de WordPress REST API. Schoont Fusion Builder HTML op,
detecteert video-embeds, en downloadt alle media.

Gebruik:
    pip install requests beautifulsoup4
    python scripts/migrate_wordpress.py

Output:
    - scripts/migration/data.json          → Alle content (clean)
    - scripts/migration/assets/images/     → Gedownloade afbeeldingen
"""

import json
import os
import re
import time
import hashlib
from urllib.parse import urlparse, unquote
from pathlib import Path

import requests
from bs4 import BeautifulSoup, NavigableString

# ─── Configuratie ────────────────────────────────────────────────────
WP_BASE_URL = "https://tomveijk.nl"
WP_API_BASE = f"{WP_BASE_URL}/wp-json/wp/v2"
UPLOAD_PATTERN = re.compile(
    r'https?://tomveijk\.nl/wp-content/uploads/[^\s"\'<>)]+', re.IGNORECASE
)

# Output paden (relatief aan dit script)
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR / "migration"
IMAGES_DIR = OUTPUT_DIR / "assets" / "images"
DATA_FILE = OUTPUT_DIR / "data.json"

# Pauze tussen image downloads (seconden)
DOWNLOAD_DELAY = 0.4
# Pauze tussen API pagina's
API_DELAY = 0.3
# Requests per pagina (max 100)
PER_PAGE = 100

# Request headers
HEADERS = {
    "User-Agent": "tomveijk-migration-script/2.0"
}

# Video/embed URL patronen
VIDEO_PATTERNS = [
    # YouTube
    re.compile(r'(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)[\w\-]+[^\s"\'<>]*', re.IGNORECASE),
    # Vimeo
    re.compile(r'(?:https?://)?(?:www\.)?(?:vimeo\.com|player\.vimeo\.com/video)/[\d]+[^\s"\'<>]*', re.IGNORECASE),
    # General iframe embeds
    re.compile(r'(?:https?://)?(?:www\.)?dailymotion\.com/(?:embed/)?video/[\w]+', re.IGNORECASE),
]

# Fusion Builder shortcode tags die verwijderd moeten worden
FUSION_SHORTCODE_PATTERN = re.compile(
    r'\[/?(?:fusion_\w+|fusion-\w+|/fusion_\w+)[^\]]*\]',
    re.IGNORECASE | re.DOTALL
)

# ─── Hulpfuncties ────────────────────────────────────────────────────

def safe_filename(url: str) -> str:
    """Maak een veilige bestandsnaam van een URL, behoud originele naam."""
    parsed = urlparse(unquote(url))
    filename = os.path.basename(parsed.path)
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    if not filename or filename == '/':
        ext = '.jpg'
        filename = hashlib.md5(url.encode()).hexdigest()[:12] + ext
    return filename


def fetch_all_items(endpoint: str) -> list:
    """
    Haal ALLE items op van een WP REST API endpoint.
    Gaat automatisch door alle pagina's (pagination).
    """
    items = []
    page = 1

    while True:
        url = f"{WP_API_BASE}/{endpoint}"
        params = {"per_page": PER_PAGE, "page": page, "_embed": 1}

        print(f"  📄 Ophalen {endpoint} pagina {page}...")

        try:
            resp = requests.get(url, params=params, headers=HEADERS, timeout=30)
        except requests.RequestException as e:
            print(f"  ❌ Request fout bij {endpoint} pagina {page}: {e}")
            break

        if resp.status_code in (400, 404):
            if page == 1:
                print(f"  ⚠️  Endpoint '{endpoint}' niet gevonden (HTTP {resp.status_code})")
            break

        if resp.status_code != 200:
            print(f"  ⚠️  Status {resp.status_code} bij {endpoint} pagina {page}")
            break

        data = resp.json()
        if not data:
            break

        items.extend(data)

        total_pages = int(resp.headers.get("X-WP-TotalPages", 1))
        print(f"  ✅ Pagina {page}/{total_pages} — {len(data)} items opgehaald")

        if page >= total_pages:
            break

        page += 1
        time.sleep(API_DELAY)

    return items


def discover_custom_post_types() -> list:
    """
    Ontdek alle beschikbare custom post types via /wp-json/wp/v2/types.
    Retourneert een lijst van (rest_base, label) tuples voor niet-standaard types.
    """
    print("  🔍 Custom post types ontdekken via /wp-json/wp/v2/types...")

    builtin_types = {
        "post", "page", "attachment", "nav_menu_item",
        "wp_block", "wp_template", "wp_template_part",
        "wp_global_styles", "wp_navigation", "wp_font_family", "wp_font_face"
    }

    try:
        resp = requests.get(
            f"{WP_API_BASE}/types", headers=HEADERS, timeout=30
        )
        if resp.status_code != 200:
            print(f"  ⚠️  Kon types niet ophalen (HTTP {resp.status_code})")
            return []

        types_data = resp.json()
        custom_types = []

        for slug, info in types_data.items():
            if slug in builtin_types:
                continue
            rest_base = info.get("rest_base", slug)
            name = info.get("name", slug)
            # Check of het type een REST endpoint heeft
            rest_namespace = info.get("rest_namespace", "")
            if rest_namespace == "wp/v2":
                custom_types.append((rest_base, name))
                print(f"  ✅ Gevonden: '{name}' → endpoint: /wp-json/wp/v2/{rest_base}")

        if not custom_types:
            print("  ℹ️  Geen custom post types gevonden")

        return custom_types

    except requests.RequestException as e:
        print(f"  ❌ Fout bij ophalen types: {e}")
        return []


# ─── Fusion Builder Cleanup ──────────────────────────────────────────

def clean_fusion_shortcodes(text: str) -> str:
    """Verwijder alle Fusion Builder shortcodes uit tekst."""
    if not text:
        return text
    return FUSION_SHORTCODE_PATTERN.sub('', text)


def clean_fusion_html(html_content: str) -> str:
    """
    Verwijdert Fusion Builder wrapper HTML en shortcodes.
    Behoudt alleen de echte content: tekst, afbeeldingen, links, video's.
    """
    if not html_content:
        return ""

    # Stap 1: Verwijder Fusion shortcodes
    html_content = clean_fusion_shortcodes(html_content)

    # Stap 2: Parse met BeautifulSoup
    soup = BeautifulSoup(html_content, "html.parser")

    # Verwijder Fusion Builder wrapper divs (behoud hun children)
    fusion_class_patterns = [
        'fusion-fullwidth', 'fusion-builder-row', 'fusion-layout-column',
        'fusion_builder_column', 'fusion-column-wrapper', 'fusion-flex-container',
        'fusion-builder-column', 'fusion-row', 'fusion-flex-align',
        'fusion-content-layout', 'fusion-column-has-shadow',
        'fusion-flex-justify', 'fusion-sep-none', 'fusion-imageframe',
        'fusion-no-small-visibility', 'fusion-no-medium-visibility',
    ]

    # Herhaaldelijk unwrappen tot er geen Fusion wrappers meer zijn
    changed = True
    max_iterations = 20
    iteration = 0
    while changed and iteration < max_iterations:
        changed = False
        iteration += 1
        for div in soup.find_all(['div', 'span']):
            classes = div.get('class', [])
            class_str = ' '.join(classes) if classes else ''
            is_fusion = any(p in class_str for p in fusion_class_patterns)
            # Also check for Fusion inline style divs with no real content role
            has_fusion_style = '--awb-' in (div.get('style', '') or '')

            if is_fusion or has_fusion_style:
                div.unwrap()
                changed = True

    # Verwijder fusion-title wrappers maar behoud headings
    for div in soup.find_all('div', class_=lambda c: c and 'fusion-title' in ' '.join(c)):
        div.unwrap()

    # Verwijder lege divs/spans
    for tag in soup.find_all(['div', 'span']):
        if not tag.get_text(strip=True) and not tag.find(['img', 'video', 'iframe', 'source']):
            tag.decompose()

    # Verwijder Fusion separator elements
    for sep in soup.find_all('div', class_=lambda c: c and 'fusion-sep' in ' '.join(c)):
        sep.decompose()

    # Stap 3: Haal de resterende content op
    result = str(soup)

    # Stap 4: Ruim overbodige whitespace op
    result = re.sub(r'\n{3,}', '\n\n', result)
    result = result.strip()

    return result


def extract_clean_text(html_content: str) -> str:
    """Haal pure tekst op uit HTML (voor excerpt/description)."""
    if not html_content:
        return ""
    soup = BeautifulSoup(html_content, "html.parser")
    text = soup.get_text(separator=' ', strip=True)
    # Normaliseer whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# ─── Video/Embed Detectie ────────────────────────────────────────────

def extract_video_urls(html_content: str) -> list:
    """
    Zoek naar YouTube, Vimeo en andere video embed URLs in de content.
    Checkt zowel de raw HTML als iframe src attributen.
    """
    if not html_content:
        return []

    found_urls = set()

    # Methode 1: Regex op de hele HTML string
    for pattern in VIDEO_PATTERNS:
        matches = pattern.findall(html_content)
        for match in matches:
            url = match.strip().rstrip('"\'>')
            if not url.startswith('http'):
                url = 'https://' + url
            found_urls.add(url)

    # Methode 2: Parse iframes en haal src op
    soup = BeautifulSoup(html_content, "html.parser")
    for iframe in soup.find_all('iframe'):
        src = iframe.get('src', '')
        if src:
            for pattern in VIDEO_PATTERNS:
                if pattern.search(src):
                    found_urls.add(src)
                    break

    # Methode 3: Check voor data-video attributen (Fusion Builder)
    for tag in soup.find_all(attrs={"data-video": True}):
        video_url = tag.get("data-video", "")
        if video_url:
            found_urls.add(video_url)

    # Methode 4: Check embedded oembed URLs
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        for pattern in VIDEO_PATTERNS:
            if pattern.search(href):
                found_urls.add(href)
                break

    return sorted(found_urls)


# ─── Afbeeldingen ────────────────────────────────────────────────────

def extract_image_urls(html_content: str) -> list:
    """Zoek alle afbeelding-URLs die op wp-content/uploads staan."""
    if not html_content:
        return []

    urls = set()

    # Methode 1: Regex op de HTML
    regex_matches = UPLOAD_PATTERN.findall(html_content)
    for url in regex_matches:
        url = url.rstrip(')').rstrip('"').rstrip("'")
        urls.add(url)

    # Methode 2: Parse img tags
    soup = BeautifulSoup(html_content, "html.parser")
    for img in soup.find_all('img'):
        src = img.get('src', '')
        srcset = img.get('srcset', '')
        data_src = img.get('data-orig-file', '') or img.get('data-src', '')

        for url_candidate in [src, data_src]:
            if url_candidate and 'wp-content/uploads' in url_candidate:
                urls.add(url_candidate)

        # Srcset bevat meerdere URLs
        if srcset:
            for part in srcset.split(','):
                part = part.strip().split(' ')[0]
                if 'wp-content/uploads' in part:
                    urls.add(part)

    return sorted(urls)


def download_image(url: str, dest_dir: Path) -> str | None:
    """Download een afbeelding naar dest_dir."""
    filename = safe_filename(url)
    dest_path = dest_dir / filename

    if dest_path.exists() and dest_path.stat().st_size > 0:
        return f"/assets/images/{filename}"

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        if resp.status_code == 200:
            with open(dest_path, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            return f"/assets/images/{filename}"
        else:
            print(f"    ⚠️  HTTP {resp.status_code} voor {filename}")
            return None
    except requests.RequestException as e:
        print(f"    ❌ Download fout: {filename} — {e}")
        return None


def replace_image_urls(content: str, url_map: dict) -> str:
    """Vervang alle oude WP upload URLs door lokale paden."""
    if not content:
        return content
    for old_url, new_path in url_map.items():
        content = content.replace(old_url, new_path)
    return content


# ─── Featured Image (Deep Metadata) ─────────────────────────────────

def extract_featured_image(item: dict) -> str | None:
    """
    Haal de featured image URL op. Probeert meerdere methoden:
    1. _embedded wp:featuredmedia (als _embed=1 meegegeven)
    2. Directe API call naar de media link
    """
    # Methode 1: _embedded data
    try:
        embedded = item.get("_embedded", {})
        media_list = embedded.get("wp:featuredmedia", [])
        if media_list and len(media_list) > 0:
            media = media_list[0]
            # Probeer de grootste versie
            sizes = media.get("media_details", {}).get("sizes", {})
            for size_key in ["full", "large", "medium_large", "medium"]:
                if size_key in sizes:
                    return sizes[size_key].get("source_url")
            # Fallback naar source_url
            source = media.get("source_url")
            if source:
                return source
    except (KeyError, IndexError, TypeError):
        pass

    # Methode 2: Volg _links naar wp:featuredmedia
    try:
        links = item.get("_links", {})
        featured_links = links.get("wp:featuredmedia", [])
        if featured_links:
            media_url = featured_links[0].get("href")
            if media_url:
                resp = requests.get(media_url, headers=HEADERS, timeout=15)
                if resp.status_code == 200:
                    media_data = resp.json()
                    return media_data.get("source_url")
    except (KeyError, IndexError, TypeError, requests.RequestException):
        pass

    return None


# ─── Item Processing ─────────────────────────────────────────────────

def process_item(item: dict, item_type: str) -> dict:
    """Verwerk een enkel WP item naar een clean dict met opgeschoonde content."""
    title_raw = item.get("title", {}).get("rendered", "Geen titel")
    content_raw = item.get("content", {}).get("rendered", "")
    excerpt_raw = item.get("excerpt", {}).get("rendered", "")
    slug = item.get("slug", "")
    date = item.get("date", "")
    modified = item.get("modified", "")
    status = item.get("status", "publish")

    # Featured image (deep metadata)
    featured_image = extract_featured_image(item)

    # Video URLs detecteren VOOR cleanup (zodat we niets missen)
    video_urls = extract_video_urls(content_raw)

    # Fusion Builder cleanup
    content_clean = clean_fusion_html(content_raw)

    # Schone titel (HTML entities verwijderen)
    title_clean = BeautifulSoup(title_raw, "html.parser").get_text()

    # Excerpt: gebruik WP excerpt of genereer uit content
    excerpt_text = BeautifulSoup(excerpt_raw, "html.parser").get_text().strip()
    if not excerpt_text:
        # Genereer excerpt uit opgeschoonde content
        plain_text = extract_clean_text(content_clean)
        if len(plain_text) > 200:
            excerpt_text = plain_text[:197] + "..."
        else:
            excerpt_text = plain_text

    # Haal categorieën en tags op uit _embedded
    categories = []
    tags = []
    try:
        terms = item.get("_embedded", {}).get("wp:term", [])
        for term_group in terms:
            if not isinstance(term_group, list):
                continue
            for term in term_group:
                taxonomy = term.get("taxonomy", "")
                name = term.get("name", "")
                if taxonomy == "category":
                    categories.append(name)
                elif taxonomy == "post_tag":
                    tags.append(name)
                elif taxonomy == "portfolio_category":
                    categories.append(name)
                elif taxonomy == "portfolio_tags":
                    tags.append(name)
    except (TypeError, KeyError):
        pass

    # Afbeeldingen in de content (voor referentie)
    content_images = extract_image_urls(content_raw)

    return {
        "wp_id": item.get("id"),
        "type": item_type,
        "title": title_clean,
        "slug": slug,
        "date": date,
        "modified": modified,
        "status": status,
        "content_html": content_clean,
        "content_raw": content_raw,
        "excerpt": excerpt_text,
        "featured_image": featured_image,
        "video_urls": video_urls,
        "content_images": content_images,
        "categories": categories,
        "tags": tags,
    }


# ─── Hoofdscript ─────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("🚀 WordPress Migratie Script v2 — tomveijk.nl")
    print("=" * 60)

    # Maak output mappen aan
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Output map: {OUTPUT_DIR}")
    print(f"📁 Afbeeldingen map: {IMAGES_DIR}")

    # ─── Stap 1: Discover custom post types ──────────────────────
    print("\n── Stap 1: Custom Post Types ontdekken ──")
    custom_types = discover_custom_post_types()

    # ─── Stap 2: Alle content ophalen ────────────────────────────
    print("\n── Stap 2: Content ophalen via WP REST API ──")

    raw_data = {}  # type_name → [raw items]

    # Standaard types
    print("\n📝 Posts ophalen...")
    raw_data["posts"] = fetch_all_items("posts")
    print(f"   Totaal posts: {len(raw_data['posts'])}")

    print("\n📄 Pagina's ophalen...")
    raw_data["pages"] = fetch_all_items("pages")
    print(f"   Totaal pagina's: {len(raw_data['pages'])}")

    # Custom post types
    for rest_base, label in custom_types:
        print(f"\n🎨 {label} ophalen ({rest_base})...")
        raw_data[rest_base] = fetch_all_items(rest_base)
        print(f"   Totaal {label}: {len(raw_data[rest_base])}")

    # Verwerk naar clean format
    all_items = []
    for post in raw_data.get("posts", []):
        all_items.append(process_item(post, "post"))
    for page in raw_data.get("pages", []):
        all_items.append(process_item(page, "page"))
    for rest_base, label in custom_types:
        for item in raw_data.get(rest_base, []):
            all_items.append(process_item(item, rest_base))

    total_content = len(all_items)
    print(f"\n📊 Totaal items verwerkt: {total_content}")
    for item in all_items:
        vids = f" + {len(item['video_urls'])} video's" if item['video_urls'] else ""
        print(f"   [{item['type']}] {item['title']}{vids}")

    # ─── Stap 3: Alle afbeelding-URLs verzamelen ─────────────────
    print("\n── Stap 3: Afbeelding-URLs verzamelen ──")

    all_image_urls = set()
    for item in all_items:
        # Uit raw content (voor de cleanup)
        urls_in_raw = extract_image_urls(item["content_raw"])
        all_image_urls.update(urls_in_raw)
        # Featured image
        if item["featured_image"] and 'wp-content/uploads' in (item["featured_image"] or ""):
            all_image_urls.add(item["featured_image"])
        elif item["featured_image"]:
            all_image_urls.add(item["featured_image"])

    print(f"   Unieke afbeeldingen gevonden: {len(all_image_urls)}")

    # ─── Stap 4: Afbeeldingen downloaden ──────────────────────────
    print("\n── Stap 4: Afbeeldingen downloaden ──")

    url_map = {}
    total = len(all_image_urls)

    for i, url in enumerate(sorted(all_image_urls), 1):
        filename = safe_filename(url)
        print(f"   [{i}/{total}] {filename}...", end=" ")

        local_path = download_image(url, IMAGES_DIR)
        if local_path:
            url_map[url] = local_path
            print("✅")
        else:
            print("❌")

        if i < total:
            time.sleep(DOWNLOAD_DELAY)

    print(f"\n   Succesvol gedownload: {len(url_map)}/{total}")

    # ─── Stap 5: URLs vervangen in content ────────────────────────
    print("\n── Stap 5: Image URLs vervangen door lokale paden ──")

    for item in all_items:
        item["content_html"] = replace_image_urls(item["content_html"], url_map)
        item["content_raw"] = replace_image_urls(item["content_raw"], url_map)
        if item["featured_image"] and item["featured_image"] in url_map:
            item["featured_image"] = url_map[item["featured_image"]]
        # Update content_images met lokale paden
        item["content_images"] = [
            url_map.get(url, url) for url in item["content_images"]
        ]

    print("   ✅ Alle URLs zijn bijgewerkt")

    # ─── Stap 6: JSON opslaan ─────────────────────────────────────
    print("\n── Stap 6: Data opslaan als JSON ──")

    # Verwijder content_raw uit finale output (te groot, alleen voor processing)
    for item in all_items:
        del item["content_raw"]

    # Stats per type
    type_counts = {}
    video_count = 0
    for item in all_items:
        t = item["type"]
        type_counts[t] = type_counts.get(t, 0) + 1
        video_count += len(item["video_urls"])

    output_data = {
        "source": WP_BASE_URL,
        "migrated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "stats": {
            **{f"{k}_count": v for k, v in type_counts.items()},
            "total_items": total_content,
            "images_downloaded": len(url_map),
            "images_total": total,
            "videos_found": video_count,
        },
        "items": all_items,
    }

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"   ✅ Opgeslagen: {DATA_FILE}")
    file_size = DATA_FILE.stat().st_size
    print(f"   📦 Bestandsgrootte: {file_size / 1024:.1f} KB")

    # ─── Samenvatting ─────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("✅ Migratie v2 voltooid!")
    print("=" * 60)
    for type_name, count in type_counts.items():
        emoji = {"post": "📝", "page": "📄", "avada_portfolio": "🎨"}.get(type_name, "📦")
        print(f"   {emoji} {type_name}: {count}")
    print(f"   🖼️  Afbeeldingen: {len(url_map)}/{total} gedownload")
    print(f"   🎬 Video's: {video_count} gevonden")
    print(f"   💾 Data: {DATA_FILE}")
    print(f"   📁 Afbeeldingen: {IMAGES_DIR}")
    print()
    print("Volgende stap: bekijk data.json en importeer in je Next.js site.")
    print("=" * 60)


if __name__ == "__main__":
    main()
