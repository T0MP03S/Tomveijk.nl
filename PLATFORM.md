# Plan: klantsites draaien op de VPS

Hoe we van losse demo's naar een systeem gaan waarmee je twintig klantsites
draait zonder dat het twintig keer werk wordt.

## Het uitgangspunt

Het demosysteem is het platform al, alleen zonder eigen domeinen en zonder
inlog voor de eigenaar:

| Wat er al staat | Wat het straks is |
|---|---|
| `demos/<slug>.html` als los ontwerp | de site van de klant |
| `demos/<slug>.json` met gegevens | de instellingen van die site |
| `/demo/<slug>` serveert het bestand | `hunbedrijf.nl` serveert het bestand |
| weergaves tellen in de database | bezoekcijfers voor jou en voor hen |
| `/admin/demos` voor jou | plus `/beheer` voor de eigenaar |

Een demo en een klantsite zijn hetzelfde ding met een andere status. Dat scheelt
een tweede systeem bouwen.

## De kern: bestanden met invulplekken

Het enige echte ontwerpprobleem: de eigenaar wil zijn openingstijden kunnen
wijzigen, maar elke site moet er anders uitzien. Volledig databasegestuurd
betekent één sjabloon voor iedereen. Volledig statisch betekent dat niemand
iets kan aanpassen.

De oplossing: het bestand blijft een vrij ontwerp, met genoemde invulplekken
erin.

```html
<h1>{{ kop }}</h1>
<p>{{ intro }}</p>
<ul>{{ openingstijden }}</ul>
```

Bij het serveren leest de app het bestand en vult de plekken uit de database.
Daarmee krijg je drie dingen tegelijk:

1. **Het ontwerp blijft per klant volledig vrij**, want het is gewoon een bestand
2. **De eigenaar kan bewerken wat jij bewerkbaar maakt**, en niets anders
3. **Het beheerpaneel is overal hetzelfde**, want het formulier wordt gegenereerd
   uit de invulplekken die in dat bestand staan

Dat laatste is de kern van je vraag. Je bouwt het beheerpaneel één keer. Zet je
in een site `{{ openingstijden }}`, dan verschijnt dat veld vanzelf in het
paneel van die klant. Zet je het er niet in, dan is het er niet.

## Wat overal hetzelfde is

Dit bouw je één keer en het geldt voor elke klant:

- Hosting, TLS-certificaten en domeinkoppeling
- Bezoekcijfers
- Contactformulier: afhandeling, spamfilter, doorsturen en bewaren
- Beheerpaneel voor de eigenaar
- Back-ups
- Uptime-bewaking
- Beveiligingskoppen en caching

## Wat per klant verschilt

- Het ontwerp, volledig
- Welke invulplekken er zijn, en dus wat de eigenaar kan bewerken
- Het domein
- Of er überhaupt een beheerpaneel is: dat hoort bij het pakket Compleet, niet
  bij Basis. Zonder beheeromgeving ben jij nodig voor wijzigingen, en dat is
  precies waarom €20 per maand logisch is

## Het beheerpaneel voor de eigenaar

Op `beheer.tomveijk.nl`, met een eigen inlog per klant. Wat hij ziet:

- **Bezoekers**: hoeveel mensen, welke pagina's, waar ze vandaan komen
- **Aanvragen**: alles wat er via het contactformulier binnenkwam
- **Teksten**: de invulplekken uit zijn eigen site
- **Openingstijden**, als die in zijn site zitten

Wat hij níet ziet: andere klanten, het ontwerp, de code. Eén account hoort bij
één site.

## Bezoekcijfers

Elk verzoek gaat door de app heen, dus tellen kan zonder extern hulpmiddel:
geen Google Analytics, geen cookiebanner, geen trackers. Dat is meteen een
verkoopargument, want een cookiebanner is voor kleine bedrijven een bron van
ergernis en juridisch gedoe.

Per dag samenvatten in plaats van elk verzoek bewaren, anders groeit de database
onnodig.

## Contactformulieren

Eén eindpunt voor alle sites. Per site het doeladres. Verstuurde aanvragen
worden opgeslagen én gemaild, zodat er niets verdwijnt als de mail eens niet
aankomt. Spam tegenhouden met een verborgen veld en een limiet per IP, niet met
een captcha: die kost je echte aanvragen.

## Domeinen

Klant wijst zijn domein naar de VPS, Traefik regelt het certificaat
automatisch, de app kijkt bij binnenkomst welk domein het is en dient de
bijbehorende site op.

**Raak nooit hun MX-records aan.** Verandert daar iets, dan ligt hun mail plat
en ben je de klant én je naam in de regio kwijt. Alleen A- en CNAME-records, en
maak vooraf een schermafbeelding van hun oude instellingen.

## Wat dit je VPS kost

Belangrijke reden om het zo te doen: één app die alle sites bedient, niet één
container per klant.

| | RAM |
|---|---|
| Je VPS totaal | 3,7 GB |
| Nu in gebruik | ~1,6 GB |
| Eén platform-app voor alle klantsites | ~250 MB |
| Twintig losse containers zou zijn | ~4 GB, past dus niet |

Een pagina opdienen is een bestand lezen plus een paar databaseregels. Daar
passen tientallen kleine sites in zonder dat je iets merkt.

## Risico's, eerlijk

**Eén app plat betekent alle klantsites plat.** Dat is de keerzijde van
gedeelde infrastructuur, en met betalende klanten is dat een echte
verantwoordelijkheid. Uptime-bewaking is daarom geen luxe maar de eerste stap.
Wil je het steviger, dan kun je later elke site ook als plat HTML-bestand
wegschrijven dat Traefik rechtstreeks kan serveren als de app eruit ligt.

**SQLite is één bestand.** Prima voor deze schaal, maar zonder back-up ben je
bij een kapot volume alles kwijt: klanten, teksten, aanvragen. Elke nacht een
kopie van de VPS af, en af en toe controleren of je die kopie ook echt terug
kunt zetten.

**Je bewaart persoonsgegevens van hun klanten.** Contactaanvragen bevatten
namen, telefoonnummers en adressen. Daarmee word je verwerker voor je klant.
Voor een eenmanszaak is dat te overzien, maar het hoort wel in je voorwaarden
te staan, en je moet aanvragen na verloop van tijd opruimen.

**Je wordt afhankelijk van jezelf.** Twintig klanten die €20 per maand betalen
verwachten dat je er bent. Dat is een prettige inkomstenstroom en tegelijk een
verplichting. Houd het systeem daarom simpel genoeg dat je het over een jaar
nog snapt.

## Fasering

Niet alles tegelijk. Elke fase levert iets bruikbaars op.

**Fase 1: de eerste klant, handmatig.** Zijn site als bestand, gekoppeld aan
zijn domein, contactformulier werkend. Geen beheerpaneel, geen invulplekken. Je
doet wijzigingen zelf, want dat is precies wat Basis inhoudt. Hiermee verdien
je je eerste €750 zonder dat er een platform hoeft te staan.

**Fase 2: het saaie maar noodzakelijke werk.** Uptime-bewaking, nachtelijke
back-up, en een controle die je waarschuwt als een certificaat bijna verloopt.
Dit gaat vóór alle mooie functies, want dit is wat je verkoopt als "onderhoud".

**Fase 3: bezoekcijfers.** Tellen zonder cookiebanner, zichtbaar in jouw admin.
Meteen een reden om je klant te bellen: "je site trok vorige maand veertig
bezoekers, zullen we er iets aan toevoegen?"

**Fase 4: invulplekken en het beheerpaneel.** Pas bouwen als je een klant hebt
die voor Compleet betaalt. Eerder is het werk zonder opbrengst.

**Fase 5: eigen accounts voor eigenaren.** Als er meerdere klanten met een
beheerpaneel zijn.

## Wat ik zou doen

Fase 1 en 2, en verder niets, tot er een klant is. Het platform is pas geld
waard als er iemand voor betaalt, en de fasen daarna zijn een stuk makkelijker
te ontwerpen als je één echte klant hebt gezien in plaats van er een te
bedenken.
