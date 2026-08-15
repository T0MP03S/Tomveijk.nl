# Portfolio-items in bestanden

Portfolio-items leven in de database, en die staat in productie in een eigen
Docker-volume. Zonder deze bestanden zou je na een verhuizing of een lege
database alles met de hand moeten overtikken in de live admin.

Eén bestand per item: `portfolio/<slug>.json`. De bestandsnaam is de slug.

## Werkwijze

Push je een nieuw bestand, dan maakt de container het item bij het opstarten
aan. Verder hoef je niets te doen.

Lokaal draaien kan met:

```bash
npm run portfolio:sync
```

## Wat het script wel en niet doet

**Bestaande items worden niet overschreven.** Je bewerkt ze in de admin, en dat
mag een deploy niet wissen. Twee uitzonderingen, allebei expliciet:

1. Velden die je in `bijwerken` zet worden wel bijgezet. Bedoeld voor eenmalige
   correcties, zoals een item dat van `PROJECT` naar `WEBSITE` moet.
2. Een blok wordt toegevoegd als er nog geen blok van dat type op het item zit.
   Zo komt een ingesloten website bovenaan te staan zonder dat een tweede
   deploy hem er nog een keer bij zet.

Allebei zijn herhaalbaar: twee keer draaien verandert niets meer.

## Voorbeeld

```json
{
  "titel": "Klasflix",
  "type": "WEBSITE",
  "omschrijving": "Zoekmachine voor het onderwijs.",
  "thumbnail": "/assets/images/klasflix-logo.png",
  "gepubliceerd": true,
  "volgorde": 0,
  "blokken": [
    { "type": "PHOTO", "inhoud": { "url": "/assets/images/klasflix-logo.png", "caption": "", "layout": "full" } },
    { "type": "TEXT", "inhoud": { "text": "Wat het project doet." } }
  ]
}
```

`titel`, `type`, `omschrijving` en `thumbnail` zijn verplicht. Optioneel:
`embedUrl`, `gepubliceerd`, `volgorde`, `projectdatum` en `bijwerken`.

Bloktypes die de site kent: `TITLE`, `SUBTITLE`, `TEXT`, `PHOTO`, `GALLERY`,
`SLIDER`, `VIDEO`, `WEBSITE`, `LINK`, `PDF`, `BUSINESSCARD`.

## Let op bij ingesloten websites

Een `WEBSITE`-blok met `"type": "embed"` toont de site in een venster op de
pagina. Dat werkt alleen als die site inbedden toestaat. Klasflix bijvoorbeeld
blokkeert dat (`frame-ancestors 'self'`), dus daar staat een knop naar de site
in plaats van een venster. Controleer dat voordat je een embed toevoegt, anders
staat er een leeg kader op je pagina.

## Afbeeldingen

Die staan in `public/assets/images/` en gaan gewoon mee in git, dus die hoef je
niet apart te regelen.
