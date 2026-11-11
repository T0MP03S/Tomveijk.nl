(function () {
  var rustig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      lijst = Array.prototype.filter.call(groep.querySelectorAll(".tegel"), function (x) { return !x.classList.contains("weg"); });
      open(lijst.indexOf(t));
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
