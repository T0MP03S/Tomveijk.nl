/**
 * Zet portfoliobestanden om in portfolio-items.
 *
 * Portfolio-items leven in de database, en die staat in productie in een eigen
 * Docker-volume. Zonder dit script zou je alles met de hand moeten overtikken
 * in de live admin na elke verhuizing of lege database.
 *
 * Uitgangspunt is hetzelfde als bij de demo's: **bestaande items worden niet
 * overschreven**, want je bewerkt ze in de admin en dat mag een deploy niet
 * wissen. Twee uitzonderingen, allebei expliciet en herhaalbaar:
 *
 * 1. Velden die in `bijwerken` staan worden wel bijgezet. Dat is bedoeld voor
 *    eenmalige correcties, zoals een item dat van PROJECT naar WEBSITE moet.
 * 2. Een blok wordt toegevoegd als er nog geen blok van dat type op het item
 *    zit. Zo komt een ingesloten website bovenaan te staan zonder dat een
 *    tweede deploy hem er nog een keer bij zet.
 *
 * Draait bij het opstarten van de container en lokaal met `npm run portfolio:sync`.
 */

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const MAP = path.join(process.cwd(), 'portfolio')

function lees(bestand) {
  try {
    return JSON.parse(fs.readFileSync(bestand, 'utf8'))
  } catch (error) {
    console.error(`  ! ${path.basename(bestand)} overgeslagen: ${error.message}`)
    return null
  }
}

async function main() {
  if (!fs.existsSync(MAP)) {
    console.log('Geen portfolio-map gevonden, niets te synchroniseren.')
    return
  }

  const bestanden = fs.readdirSync(MAP).filter((n) => n.endsWith('.json'))
  if (bestanden.length === 0) {
    console.log('Geen portfoliobestanden gevonden.')
    return
  }

  const prisma = new PrismaClient()
  let aangemaakt = 0
  let bijgewerkt = 0
  let blokken = 0

  try {
    for (const naam of bestanden) {
      const slug = naam.replace(/\.json$/, '')
      const d = lees(path.join(MAP, naam))
      if (!d) continue

      if (!d.titel || !d.type || !d.omschrijving || !d.thumbnail) {
        console.error(`  ! ${naam} mist titel/type/omschrijving/thumbnail, overgeslagen`)
        continue
      }

      const bestaat = await prisma.portfolioItem.findUnique({
        where: { slug },
        include: { blocks: true },
      })

      if (!bestaat) {
        await prisma.portfolioItem.create({
          data: {
            slug,
            title: d.titel,
            type: d.type,
            description: d.omschrijving,
            thumbnail: d.thumbnail,
            embedUrl: d.embedUrl || null,
            published: d.gepubliceerd !== false,
            order: Number.isInteger(d.volgorde) ? d.volgorde : 0,
            projectDate: d.projectdatum ? new Date(d.projectdatum) : null,
            blocks: {
              create: (d.blokken ?? []).map((b, i) => ({
                type: b.type,
                order: i,
                content: JSON.stringify(b.inhoud),
              })),
            },
          },
        })
        aangemaakt++
        console.log(`  + ${slug}: ${d.titel} (${(d.blokken ?? []).length} blokken)`)
        continue
      }

      // Bestaat al. Alleen de expliciet genoemde velden bijwerken.
      const teZetten = {}
      for (const veld of d.bijwerken ?? []) {
        if (veld === 'type' && bestaat.type !== d.type) teZetten.type = d.type
        if (veld === 'embedUrl' && bestaat.embedUrl !== (d.embedUrl || null)) {
          teZetten.embedUrl = d.embedUrl || null
        }
        if (veld === 'thumbnail' && bestaat.thumbnail !== d.thumbnail) {
          teZetten.thumbnail = d.thumbnail
        }
      }

      if (Object.keys(teZetten).length > 0) {
        await prisma.portfolioItem.update({ where: { slug }, data: teZetten })
        bijgewerkt++
        console.log(`  ~ ${slug}: ${Object.keys(teZetten).join(', ')} bijgewerkt`)
      }

      // Ontbrekende bloktypes aanvullen, vooraan. Bestaat het type al, dan
      // gebeurt er niets, dus een tweede deploy voegt niets dubbel toe.
      const aanwezig = new Set(bestaat.blocks.map((b) => b.type))
      for (const b of d.blokken ?? []) {
        if (aanwezig.has(b.type)) continue
        await prisma.contentBlock.updateMany({
          where: { portfolioItemId: bestaat.id },
          data: { order: { increment: 1 } },
        })
        await prisma.contentBlock.create({
          data: {
            portfolioItemId: bestaat.id,
            type: b.type,
            order: 0,
            content: JSON.stringify(b.inhoud),
          },
        })
        aanwezig.add(b.type)
        blokken++
        console.log(`  ~ ${slug}: blok ${b.type} toegevoegd`)
      }
    }

    console.log(
      `Portfolio gesynchroniseerd: ${aangemaakt} nieuw, ${bijgewerkt} bijgewerkt, ${blokken} blokken toegevoegd.`,
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  // Nooit de start van de app blokkeren.
  console.error('Synchroniseren van portfolio mislukt:', error.message)
  process.exitCode = 0
})
