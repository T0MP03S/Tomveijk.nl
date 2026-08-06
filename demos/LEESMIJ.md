# Demopagina's

Elke demo bestaat uit drie dingen:

```
demos/hoveniersbedrijf-jansen.html      het ontwerp
demos/hoveniersbedrijf-jansen.json      de bedrijfsgegevens
public/demos/hoveniersbedrijf-jansen/   de foto's
```

De bestandsnaam is de slug, en dus de URL: `/demo/hoveniersbedrijf-jansen`.

## Werkwijze

1. Stuur de website van het bedrijf naar Claude Code
2. De drie onderdelen hierboven worden aangemaakt
3. `git push`, dan bouwt Coolify en zet het online
4. Bij het opstarten maakt de container het prospect automatisch aan

Daarna staat het bedrijf in `/admin/demos` en is de link bereikbaar. Meer hoef
je niet te doen.

## Waarom losse bestanden en geen sjabloon

Met één template krijgen twintig hoveniers in dezelfde regio exact dezelfde
pagina. Dat verraadt meteen dat het massawerk is, en als de demo er
sjabloonmatig uitziet, gaat de klant ervan uit dat de site van €750 dat ook
wordt. De demo ís het verkooppraatje.

Als los bestand erft de pagina bovendien niets van deze site: geen Tailwind,
geen donker thema, geen lettertypes die doorlekken. Volledige vrijheid per
ontwerp. En omdat alles in git staat, kan een demo nooit kwijtraken en is elke
versie terug te halen.

## Het gegevensbestand

```json
{
  "bedrijf": "Hoveniersbedrijf Jansen",
  "branche": "hovenier",
  "plaats": "Baarn",
  "regio": "Baarn en omstreken",
  "huidigeSite": "https://hun-huidige-site.nl",
  "contact": "Voornaam Achternaam",
  "email": "info@hun-site.nl",
  "telefoon": "035 - 123 45 67",
  "gepubliceerd": true,
  "pitchPrijs": 750,
  "pitchPerMaand": 20
}
```

`bedrijf`, `branche`, `plaats` en `regio` zijn verplicht; de rest is optioneel.
Zet `"gepubliceerd": false` als de link nog niet bereikbaar mag zijn.

## De synchronisatie

`scripts/sync-demos.js` draait bij het opstarten van de container en maakt
prospects aan die nog niet bestaan. **Bestaande prospects worden nooit
overschreven**: status, notities en datums zijn handwerk in de admin, en die
mag een deploy niet wissen.

Lokaal draaien kan met:

```bash
npm run demos:sync
```

## Foto's

Download ze en zet ze in `public/demos/<slug>/`. Nooit rechtstreeks naar de
foto's op hun eigen server linken: veel hosts blokkeren dat, en dan ziet de
prospect kapotte plaatjes zonder dat jij het merkt. Bovendien maken foto's van
hun trage hosting jouw demo net zo traag als hun eigen site, terwijl snelheid
precies is wat je verkoopt.

## De verkoopbalk

Zit niet in de pagina zelf; die wordt er bij het serveren in geplakt (zie
`lib/demo-bestand.ts`), met een eigen klasse-prefix zodat hij nooit botst met
het ontwerp eromheen. Per prospect aan of uit te zetten in de admin. Uit dus,
zodra iemand klant wordt.

## Handmatig een prospect toevoegen

`/admin/demos/nieuw` bestaat nog voor bedrijven die je wilt bijhouden zonder
dat er (al) een demo van is, bijvoorbeeld een warme tip uit je netwerk.
