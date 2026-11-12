(function () {
  var rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Scrollfilm: van tekening tot huis (170 frames uit Blender)
  // De film staat stil bij elk hoofdstuk (rustpunt). Scrollen speelt het stuk tot het volgende rustpunt af;
  // met scroll-snap kun je geen rustpunt overslaan, hoe snel je ook scrolt.
  var film = document.querySelector(".film");
  if (film) {
    var AANTAL = 170, PAD = film.getAttribute("data-pad");
    var RUST = [1, 16, 37, 72, 86, 135, 145, 170];      // frame per hoofdstuk; hoofdstuk 0 is de bouwtekening
    var N = RUST.length, HOUD = 0.32;                    // deel van elk stuk waarin het beeld stilstaat
    var doek = film.querySelector(".film-doek"), ctx = doek.getContext("2d");
    var tek = film.querySelector(".film-tekening"), hfst = film.querySelectorAll(".hfst"), stap = film.querySelectorAll(".film-stappen li");
    var menu = document.querySelector(".menu");
    var set = null, ext = "webp", frames = [], doelP = 0, p = 0, actief = 0, loopt = false, mh = 0, totaal = 1;
    function glad(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
    // q (0-1 door de film) -> positie in hoofdstukken (0..N-1), met stilstand rond elk rustpunt
    function stand(q) {
      var x = Math.max(0, Math.min(1, q)) * (N - 1), i = Math.floor(x), f = x - i;
      if (i >= N - 1) return N - 1;
      var h = HOUD / 2;
      if (f < h) return i;
      if (f > 1 - h) return i + 1;
      return i + glad((f - h) / (1 - 2 * h));
    }
    function frameVan(q) {
      var st = stand(q), i = Math.floor(st), f = st - i;
      if (i >= N - 1) return RUST[N - 1];
      return RUST[i] + (RUST[i + 1] - RUST[i]) * f;
    }
    function laad() {
      frames = [];
      var volgorde = RUST.slice(), i;
      for (i = 5; i < AANTAL; i += 5) if (volgorde.indexOf(i) < 0) volgorde.push(i);
      for (i = 2; i < AANTAL; i++) if (volgorde.indexOf(i) < 0) volgorde.push(i);
      var mijnSet = set, pos = 0;
      function volgende() {
        if (mijnSet !== set || pos >= volgorde.length) return;
        var nr = volgorde[pos++], im = new Image();
        im.decoding = "async";
        im.onload = im.onerror = function () { if (mijnSet === set) { frames[nr] = im.naturalWidth ? im : null; teken(); } volgende(); };
        im.src = PAD + set + "/f" + String(nr).padStart(3, "0") + "." + ext;
      }
      for (var k = 0; k < 6; k++) volgende();
    }
    function kiesSet() {
      var s = window.innerWidth / window.innerHeight < 1 ? "tel" : "breed";
      if (s !== set) { set = s; laad(); }
    }
    function maat() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      doek.width = Math.round(doek.clientWidth * dpr); doek.height = Math.round(doek.clientHeight * dpr);
      // het menu zweeft boven de film; het filmscherm begint bovenaan (top van .film-plak)
      mh = parseFloat(getComputedStyle(film.querySelector(".film-plak")).top) || 0;
      totaal = film.offsetHeight - (window.innerHeight - mh);
      // snappunten op de rustpunten
      var punten = film.querySelectorAll(".film-punt");
      for (var i = 0; i < punten.length; i++) punten[i].style.top = Math.round(totaal * i / (N - 1)) + "px";
      teken();
    }
    function teken() {
      var cw = doek.width, ch = doek.height; if (!cw) return;
      var fi = Math.round(frameVan(p)), im = null;
      for (var d = 0; d < AANTAL && !im; d++) im = frames[fi - d] || frames[fi + d] || null;
      if (!im) return;
      var s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
      var x = set === "breed" ? cw - w : (cw - w) / 2;
      var y = set === "tel" ? ch - h : (ch - h) / 2;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, cw, ch); ctx.drawImage(im, x, y, w, h);
    }
    function werk() {
      p += (doelP - p) * (rustig ? 1 : 0.2);
      if (Math.abs(doelP - p) < 0.0004) p = doelP;
      var st = stand(p);
      tek.style.opacity = String(1 - glad(st / 0.6));
      teken();
      var h = Math.round(st);
      if (h !== actief) { hfst[actief].classList.remove("aan"); hfst[h].classList.add("aan"); actief = h; }
      for (var j = 0; j < stap.length; j++) stap[j].classList.toggle("klaar", j < h);
      film.classList.toggle("nacht", frameVan(p) >= 152);
      if (p !== doelP) requestAnimationFrame(werk); else loopt = false;
    }
    function scrol() {
      var r = film.getBoundingClientRect();
      // snappen alleen zolang je in de film bent; daarna scrolt de pagina vrij
      var binnen = r.bottom >= window.innerHeight - 2;
      document.body.classList.toggle("in-film", r.bottom > window.innerHeight * 0.98);
      doelP = Math.max(0, Math.min(1, (mh - r.top) / totaal));
      if (!loopt) { loopt = true; requestAnimationFrame(werk); }
    }
    // ---- een hoofdstuk per scrollbeweging: de film stopt bij elk rustpunt, inertie wordt genegeerd
    var bezig = false, slot = 0, veegY = null;
    function stopY(i) { return film.getBoundingClientRect().top + window.scrollY - mh + totaal * i / (N - 1); }
    function doel(dir) {
      var y = window.scrollY, i;
      if (dir > 0) { for (i = 0; i < N; i++) if (stopY(i) > y + 6) return i; }
      else { for (i = N - 1; i >= 0; i--) if (stopY(i) < y - 6) return i; }
      return -1;
    }
    function inZone() { var r = film.getBoundingClientRect(); return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight - 4; }
    function naar(i) {
      // duur volgt het aantal frames tussen de stops, zodat het stuk rustig als film afspeelt
      var van = window.scrollY, tot = stopY(i), t0 = null, stuk = totaal / (N - 1);
      var j = Math.max(0, Math.min(N - 1, Math.round((van - stopY(0)) / stuk)));
      var frames = Math.abs(RUST[i] - RUST[j]) || 6;
      var duur = rustig ? 0 : Math.max(1500, Math.min(4000, 900 + frames * 60));
      bezig = true;
      document.documentElement.style.scrollBehavior = "auto";
      function stapje(ts) {
        if (t0 === null) t0 = ts;
        var t = duur ? Math.min(1, (ts - t0) / duur) : 1, e = -(Math.cos(Math.PI * t) - 1) / 2;
        window.scrollTo(0, van + (tot - van) * e);
        if (t < 1) requestAnimationFrame(stapje); else { bezig = false; slot = performance.now() + 180; document.documentElement.style.scrollBehavior = ""; }
      }
      requestAnimationFrame(stapje);
    }
    // geeft true als de beweging is afgevangen
    function richting(dir, ev) {
      if (!inZone()) return false;
      var i = doel(dir);
      if (i < 0) return false;                              // geen stop meer in deze richting: gewoon scrollen
      if (ev) ev.preventDefault();
      if (bezig || performance.now() < slot) { slot = Math.max(slot, performance.now() + 200); return true; }
      naar(i); return true;
    }
    window.addEventListener("wheel", function (ev) {
      if (Math.abs(ev.deltaY) < 4) return;
      richting(ev.deltaY > 0 ? 1 : -1, ev);
    }, { passive: false });
    // vegen: een veeg is precies een stap. Zolang de vinger op het scherm ligt na de stap, vangen we
    // alle bewegingen af, anders scrolt de telefoon zelf door (met vaart) en sla je hoofdstukken over.
    var gevangen = false, gestapt = false;
    window.addEventListener("touchstart", function (ev) { veegY = ev.touches[0].clientY; gevangen = false; gestapt = false; }, { passive: true });
    window.addEventListener("touchmove", function (ev) {
      if (veegY === null) return;
      if (gevangen || bezig) { ev.preventDefault(); if (gestapt || bezig) return; }
      var d = veegY - ev.touches[0].clientY;
      if (!gevangen) {
        if (!inZone() || doel(d > 0 ? 1 : -1) < 0) return;
        gevangen = true;
      }
      ev.preventDefault();
      if (Math.abs(d) > 24) { richting(d > 0 ? 1 : -1, null); gestapt = true; }
    }, { passive: false });
    window.addEventListener("touchend", function () { veegY = null; gevangen = false; gestapt = false; }, { passive: true });
    window.addEventListener("touchcancel", function () { veegY = null; gevangen = false; gestapt = false; }, { passive: true });
    window.addEventListener("keydown", function (ev) {
      var k = ev.key, dir = (k === "ArrowDown" || k === "PageDown" || (k === " " && !ev.shiftKey)) ? 1 : (k === "ArrowUp" || k === "PageUp" || (k === " " && ev.shiftKey)) ? -1 : 0;
      if (dir && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) richting(dir, ev);
    });
    // snappunten aanmaken
    for (var sp = 0; sp < N; sp++) { var d = document.createElement("div"); d.className = "film-punt"; d.setAttribute("aria-hidden", "true"); film.appendChild(d); }
    var test = new Image();
    test.onload = function () { if (test.width > 0) ext = "avif"; start(); };
    test.onerror = start;
    test.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    var gestart = false;
    function start() {
      if (gestart) return; gestart = true;
      kiesSet(); maat(); scrol();
      window.addEventListener("scroll", scrol, { passive: true });
      window.addEventListener("resize", function () { kiesSet(); maat(); scrol(); });
    }
  }

  // ---------- Van bouwtekening naar foto
  var vak = document.querySelector(".tekenvak");
  if (vak) {
    var projecten = JSON.parse(vak.getAttribute("data-projecten"));
    var beeld = vak.querySelector(".tv-beeld");
    var tekening = vak.querySelector(".tv-tekening");
    var foto = vak.querySelector(".tv-foto");
    var schuif = vak.querySelector(".tv-schuif");
    var naam = vak.querySelector(".tv-naam");
    var punten = vak.querySelectorAll(".tv-punten button");
    var nu = 0, p = 100, anim = null, wacht = null, handmatig = false;

    // alle beelden alvast laden zodat de wissel niet hapert
    projecten.forEach(function (pr) { [pr.t, pr.f].forEach(function (s) { var i = new Image(); i.src = s; }); });

    function zet(v) {
      p = Math.max(0, Math.min(100, v));
      beeld.style.setProperty("--p", p + "%");
      schuif.value = p;
    }
    function glad(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function animeer(van, naar, duur, klaar) {
      cancelAnimationFrame(anim);
      var start = null;
      function stap(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / duur);
        zet(van + (naar - van) * glad(t));
        if (t < 1) anim = requestAnimationFrame(stap); else if (klaar) klaar();
      }
      anim = requestAnimationFrame(stap);
    }
    function toon(i, direct) {
      nu = (i + projecten.length) % projecten.length;
      var pr = projecten[nu];
      tekening.src = pr.t; foto.src = pr.f; foto.alt = pr.n;
      naam.textContent = pr.n;
      punten.forEach(function (b, j) { if (j === nu) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      zet(100);
      if (rustig || direct) { zet(50); return; }
      clearTimeout(wacht);
      wacht = setTimeout(function () {
        animeer(100, 0, 2600, function () {
          if (!handmatig) wacht = setTimeout(function () { toon(nu + 1); }, 4200);
        });
      }, 900);
    }
    schuif.addEventListener("input", function () {
      handmatig = true; clearTimeout(wacht); cancelAnimationFrame(anim);
      zet(Number(schuif.value));
    });
    punten.forEach(function (b, j) { b.addEventListener("click", function () { handmatig = false; toon(j); }); });
    // pas starten als het vak in beeld is
    var gestart = false;
    new IntersectionObserver(function (l) { if (l[0].isIntersecting && !gestart) { gestart = true; toon(0); } }, { threshold: .3 }).observe(vak);
  }

  // ---------- Videoportret: Vimeo pas laden na een klik
  document.querySelectorAll(".video").forEach(function (v) {
    var knop = v.querySelector(".speel");
    knop.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://player.vimeo.com/video/" + v.getAttribute("data-vimeo") + "?autoplay=1&title=0&byline=0&portrait=0&dnt=1";
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      f.title = "Videoportret van Odink Verbouw & Onderhoud";
      v.innerHTML = ""; v.appendChild(f);
    });
  });

  // ---------- Projecten filteren
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-filter");
      chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      document.querySelectorAll(".raster-filter .tegel").forEach(function (t) {
        t.classList.toggle("weg", f !== "*" && t.getAttribute("data-cat") !== f);
      });
    });
  });

  // ---------- Lichtbak
  var lb = document.querySelector(".lichtbak");
  if (lb) {
    var lbImg = lb.querySelector("img"), lbTekst = lb.querySelector(".lb-tekst"), lijst = [], idx = 0;
    function open(i) {
      idx = (i + lijst.length) % lijst.length;
      var t = lijst[idx];
      lbImg.src = t.getAttribute("data-groot"); lbImg.alt = t.getAttribute("data-tekst");
      lbTekst.textContent = t.getAttribute("data-tekst") + "  ·  " + (idx + 1) + " / " + lijst.length;
      if (!lb.open) lb.showModal();
    }
    document.addEventListener("click", function (ev) {
      var t = ev.target.closest(".tegel");
      if (!t) return;
      var groep = t.parentElement;
      lijst = Array.prototype.filter.call(groep.querySelectorAll(".tegel"), function (x) { return !x.classList.contains("weg") && !x.hasAttribute("data-kopie"); });
      var i = lijst.indexOf(t);
      if (i < 0) for (var k = 0; k < lijst.length; k++) if (lijst[k].getAttribute("data-groot") === t.getAttribute("data-groot")) i = k;
      open(Math.max(0, i));
    });
    lb.querySelector(".lb-dicht").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-vorige").addEventListener("click", function () { open(idx - 1); });
    lb.querySelector(".lb-volgende").addEventListener("click", function () { open(idx + 1); });
    lb.addEventListener("click", function (ev) { if (ev.target === lb) lb.close(); });
    document.addEventListener("keydown", function (ev) {
      if (!lb.open) return;
      if (ev.key === "ArrowLeft") open(idx - 1);
      if (ev.key === "ArrowRight") open(idx + 1);
    });
  }

  // ---------- Mobiel menu
  var mk = document.querySelector(".menuknop"), mm = document.querySelector(".mobielmenu");
  if (mk && mm) {
    mk.addEventListener("click", function () {
      var openen = mm.hasAttribute("hidden");
      if (openen) mm.removeAttribute("hidden"); else mm.setAttribute("hidden", "");
      mk.setAttribute("aria-expanded", openen ? "true" : "false");
      mk.setAttribute("aria-label", openen ? "Menu sluiten" : "Menu openen");
      document.body.style.overflow = openen ? "hidden" : "";
    });
  }

  // ---------- Formulier (demo)
  document.querySelectorAll(".formulier").forEach(function (f) {
    f.addEventListener("submit", function (ev) { ev.preventDefault(); f.querySelector(".melding").style.display = "block"; });
  });

  // ---------- Binnenkomen bij scrollen en belbalk
  var items = document.querySelectorAll(".in");
  if (!("IntersectionObserver" in window)) { items.forEach(function (x) { x.classList.add("zichtbaar"); }); return; }
  var io = new IntersectionObserver(function (l) { l.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("zichtbaar"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (x) { io.observe(x); });
  var balk = document.querySelector(".belbalk"), contact = document.getElementById("contact");
  if (balk && contact) new IntersectionObserver(function (l) { balk.classList.toggle("weg", l[0].isIntersecting); }, { threshold: .2 }).observe(contact);
})();
