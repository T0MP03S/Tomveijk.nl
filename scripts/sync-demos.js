/**
 * Zet demopagina's om in prospects.
 *
 * Naast elke demos/<slug>.html staat een demos/<slug>.json met de
 * bedrijfsgegevens. Dit script leest die bestanden en maakt de prospects aan
 * die nog niet bestaan, zodat een nieuwe demo alleen een push kost en niemand
 * de gegevens nog met de hand hoeft over te tikken.
 *
 * Bestaande prospects worden NOOIT overschreven: status, notities en datums
 * zijn handwerk in de admin, en die mag een deploy niet wissen.
 *
 * Draait bij het opstarten van de container (zie docker-entrypoint.sh) en
 * lokaal met `npm run demos:sync`.
 */

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const DEMO_MAP = path.join(process.cwd(), 'demos')

function lees(bestand) {
  try {
    return JSON.parse(fs.readFileSync(bestand, 'utf8'))
  } catch (error) {
    console.error(`  ! ${path.basename(bestand)} overgeslagen: ${error.message}`)
    return null
  }
}

async function main() {
  if (!fs.existsSync(DEMO_MAP)) {
    console.log('Geen demos-map gevonden — niets te synchroniseren.')
    return
  }

  const bestanden = fs.readdirSync(DEMO_MAP).filter((n) => n.endsWith('.json'))
  if (bestanden.length === 0) {
    console.log('Geen demo-gegevensbestanden gevonden.')
    return
  }

  const prisma = new PrismaClient()
  let aangemaakt = 0
  let overgeslagen = 0

  try {
    for (const naam of bestanden) {
      const slug = naam.replace(/\.json$/, '')
      const data = lees(path.join(DEMO_MAP, naam))
      if (!data) continue

      if (!data.bedrijf || !data.branche || !data.plaats || !data.regio) {
        console.error(`  ! ${naam} mist bedrijf/branche/plaats/regio — overgeslagen`)
        continue
      }

      const bestaat = await prisma.prospect.findUnique({ where: { slug } })
      if (bestaat) {
        overgeslagen++
        continue
      }

      // Staat de pagina er al? Dan is de demo klaar om te mailen.
      const heeftPagina = fs.existsSync(path.join(DEMO_MAP, `${slug}.html`))
      const publiceren = heeftPagina && data.gepubliceerd !== false

      await prisma.prospect.create({
        data: {
          slug,
          bedrijf: data.bedrijf,
          branche: data.branche,
          plaats: data.plaats,
          regio: data.regio,
          huidigeSite: data.huidigeSite || null,
          contact: data.contact || null,
          email: data.email || null,
          telefoon: data.telefoon || null,
          status: heeftPagina ? 'DEMO_KLAAR' : 'NIEUW',
          gepubliceerd: publiceren,
          pitchActief: data.pitchActief !== false,
          pitchPrijs: Number.isInteger(data.pitchPrijs) ? data.pitchPrijs : 750,
          pitchPerMaand: Number.isInteger(data.pitchPerMaand) ? data.pitchPerMaand : 20,
        },
      })

      aangemaakt++
      const toestand = !heeftPagina
        ? 'nog geen pagina'
        : publiceren
          ? 'gepubliceerd'
          : 'pagina klaar, nog niet gepubliceerd'
      console.log(`  + ${slug} — ${data.bedrijf} (${toestand})`)
    }

    console.log(
      `Demo's gesynchroniseerd: ${aangemaakt} nieuw, ${overgeslagen} bestonden al.`,
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  // Nooit de start van de app blokkeren: een mislukte synchronisatie mag de
  // site niet platleggen.
  console.error('Synchroniseren van demo’s mislukt:', error.message)
  process.exitCode = 0
})
