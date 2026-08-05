import { readFile } from 'fs/promises'
import path from 'path'

/**
 * Demopagina's zijn losse HTML-bestanden in demos/<slug>.html.
 *
 * Elke demo is een eigen ontwerp, geen ingevuld sjabloon: twintig hoveniers in
 * dezelfde regio met exact dezelfde pagina verraden meteen dat het massawerk
 * is, en dan gaat de klant ervan uit dat de site van €750 dat ook wordt.
 *
 * Als los document erft de pagina bovendien niets van deze site — geen
 * Tailwind, geen donker thema, geen lettertypes die doorlekken. Volledige
 * vrijheid per ontwerp.
 */

const DEMO_MAP = path.join(process.cwd(), 'demos')

/** Verhindert dat een slug uit de demos-map kan breken. */
function veiligPad(slug: string): string | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const doel = path.join(DEMO_MAP, `${slug}.html`)
  if (!doel.startsWith(DEMO_MAP + path.sep)) return null
  return doel
}

export async function leesDemo(slug: string): Promise<string | null> {
  const bestand = veiligPad(slug)
  if (!bestand) return null

  try {
    return await readFile(bestand, 'utf8')
  } catch {
    return null
  }
}

export interface PitchInstellingen {
  bedrijf: string
  slug: string
  prijs: number
  perMaand: number
  jouwEmail: string
  jouwTelefoon: string
}

function ontsnap(tekst: string): string {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * De verkoopbalk onderaan elke demo.
 *
 * Bewust een balk en geen pop-up: het moment dat iemand overtuigd raakt is
 * terwijl hij de pagina bekijkt, niet later in zijn inbox. Volledig
 * zelfstandig — eigen stijlen met een eigen prefix, zodat hij nooit botst met
 * het ontwerp van de pagina eromheen.
 */
export function pitchBalk(p: PitchInstellingen): string {
  const onderwerp = `Ja, ik wil deze website — ${p.bedrijf}`
  const bericht = `Hoi Tom,

Ik heb het voorbeeld voor ${p.bedrijf} bekeken en wil graag verder.

Je kunt me bereiken op:
Telefoon:
E-mail:

Groet,`

  const mailto = `mailto:${p.jouwEmail}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(bericht)}`
  const tel = p.jouwTelefoon.replace(/[^\d+]/g, '')

  return `
<div id="tve-pitch" data-slug="${ontsnap(p.slug)}">
  <div class="tve-pitch__binnen">
    <p class="tve-pitch__tekst">
      <strong>Dit is een voorbeeld</strong> dat ik voor ${ontsnap(p.bedrijf)} heb gemaakt.
      <span class="tve-pitch__meer">De complete site &mdash; klaar binnen een week &mdash;
      kost <strong>&euro;${p.prijs} eenmalig</strong>, daarna &euro;${p.perMaand} per maand
      voor hosting en onderhoud.</span>
    </p>
    <div class="tve-pitch__knoppen">
      ${tel ? `<a class="tve-pitch__knop tve-pitch__knop--rand" href="tel:${ontsnap(tel)}">Bel me</a>` : ''}
      <a class="tve-pitch__knop tve-pitch__knop--vol" href="${ontsnap(mailto)}">Ja, ik wil dit</a>
    </div>
    <button type="button" class="tve-pitch__sluit" aria-label="Balk verbergen">&times;</button>
  </div>
</div>
<style>
  #tve-pitch{position:fixed;inset:auto 0 0 0;z-index:2147483000;transform:translateY(100%);
    transition:transform .5s cubic-bezier(.16,1,.3,1);background:rgba(17,17,19,.97);
    backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,.12);
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
  #tve-pitch.tve-pitch--aan{transform:translateY(0)}
  .tve-pitch__binnen{position:relative;max-width:76rem;margin:0 auto;padding:.9rem 3rem .9rem 1.25rem;
    display:flex;flex-direction:column;gap:.75rem}
  @media(min-width:768px){.tve-pitch__binnen{flex-direction:row;align-items:center;
    justify-content:space-between;gap:1.5rem;padding:.9rem 1.25rem}}
  .tve-pitch__tekst{margin:0;font-size:.9375rem;line-height:1.45;color:rgba(255,255,255,.75)}
  .tve-pitch__tekst strong{color:#fff;font-weight:700}
  .tve-pitch__meer{display:none}
  @media(min-width:640px){.tve-pitch__meer{display:inline}}
  .tve-pitch__knoppen{display:flex;gap:.5rem;flex-shrink:0}
  .tve-pitch__knop{display:inline-flex;align-items:center;justify-content:center;
    padding:.6rem 1.25rem;border-radius:999px;font-size:.9375rem;font-weight:700;
    text-decoration:none;white-space:nowrap;transition:background-color .18s,color .18s}
  .tve-pitch__knop--vol{background:#fff;color:#111113;flex:1}
  .tve-pitch__knop--vol:hover{background:#e6e6e6}
  .tve-pitch__knop--rand{border:2px solid rgba(255,255,255,.35);color:#fff}
  .tve-pitch__knop--rand:hover{background:rgba(255,255,255,.1)}
  @media(min-width:768px){.tve-pitch__knop--vol{flex:none}}
  .tve-pitch__sluit{position:absolute;top:.5rem;right:.75rem;width:2rem;height:2rem;
    display:flex;align-items:center;justify-content:center;background:none;border:0;
    border-radius:999px;color:rgba(255,255,255,.5);font-size:1.5rem;line-height:1;
    cursor:pointer;transition:background-color .18s,color .18s}
  .tve-pitch__sluit:hover{background:rgba(255,255,255,.1);color:#fff}
  @media(min-width:768px){.tve-pitch__sluit{position:static}}
  @media print{#tve-pitch{display:none}}
</style>
<script>
(function(){
  var balk=document.getElementById('tve-pitch');
  if(!balk)return;
  var sleutel='tve-pitch:'+balk.getAttribute('data-slug');
  try{if(sessionStorage.getItem(sleutel)==='verborgen')return;}catch(e){}
  setTimeout(function(){balk.classList.add('tve-pitch--aan');},900);
  balk.querySelector('.tve-pitch__sluit').addEventListener('click',function(){
    balk.classList.remove('tve-pitch--aan');
    try{sessionStorage.setItem(sleutel,'verborgen');}catch(e){}
  });
})();
</script>`
}

/** Zet noindex in de head en plakt de verkoopbalk voor de sluitende body-tag. */
export function bouwPagina(html: string, pitch: PitchInstellingen | null): string {
  const noindex =
    '<meta name="robots" content="noindex, nofollow, noarchive, noimageindex">'

  let uit = html.includes('</head>')
    ? html.replace('</head>', `  ${noindex}\n</head>`)
    : `${noindex}\n${html}`

  if (pitch) {
    const balk = pitchBalk(pitch)
    uit = uit.includes('</body>') ? uit.replace('</body>', `${balk}\n</body>`) : uit + balk
  }

  return uit
}
