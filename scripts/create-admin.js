// dotenv is een devDependency en zit dus niet in de productie-image. Lokaal wil
// je hem wel, in de container komen de variabelen van Docker zelf. Zonder deze
// try viel het script in productie bij elke start om op een ontbrekend pakket.
try {
  require('dotenv').config()
} catch {}

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'info@tomveijk.nl'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const bestaat = await prisma.user.findUnique({ where: { email } })

  if (bestaat) {
    // Bewust niets bijwerken. Hier stond eerder update: { password }, waardoor
    // elke deploy je wachtwoord terugzette naar ADMIN_PASSWORD, of naar
    // 'admin123' als die variabele niet gezet was. Wil je je wachtwoord
    // wijzigen, doe dat dan in de admin en niet via een deploy.
    console.log('Adminaccount bestaat al, wachtwoord ongemoeid gelaten:', email)
  } else {
    if (!process.env.ADMIN_PASSWORD) {
      console.warn(
        'LET OP: ADMIN_PASSWORD is niet gezet, het account krijgt het standaard' +
          " wachtwoord 'admin123'. Wijzig dit meteen na de eerste keer inloggen.",
      )
    }
    await prisma.user.create({
      data: { email, password: await bcrypt.hash(password, 10), name: 'Admin' },
    })
    console.log('Adminaccount aangemaakt:', email)
  }
  
  const photoshopSkill = await prisma.skill.upsert({
    where: { id: 'ps-skill' },
    update: {},
    create: {
      id: 'ps-skill',
      title: 'Photo Manipulation',
      description: 'Laat mij je foto\'s tot leven brengen met creatieve composities en perfecte retouches. Van simpele aanpassingen tot complexe manipulaties, ik maak het mogelijk!',
      icon: 'Ps',
      color: '#31A8FF',
      order: 0
    }
  })
  
  const afterEffectsSkill = await prisma.skill.upsert({
    where: { id: 'ae-skill' },
    update: {},
    create: {
      id: 'ae-skill',
      title: 'Motion Graphics',
      description: 'Van logo animaties tot complete video composities - ik breng beweging in je merk. Smooth animaties die je boodschap versterken en je publiek boeien.',
      icon: 'Ae',
      color: '#9999FF',
      order: 1
    }
  })
  
  const illustratorSkill = await prisma.skill.upsert({
    where: { id: 'ai-skill' },
    update: {},
    create: {
      id: 'ai-skill',
      title: 'Logo Design',
      description: 'Een logo is de identiteit van je merk. Ik ontwerp unieke, memorabele logo\'s die perfect aansluiten bij jouw visie en doelgroep. Van concept tot final design.',
      icon: 'Ai',
      color: '#FF9A00',
      order: 2
    }
  })

  // Let op: id is 'claude-skill' en niet 'ai-skill', want die laatste bestaat
  // al hierboven voor Adobe Illustrator.
  const promptingSkill = await prisma.skill.upsert({
    where: { id: 'claude-skill' },
    update: {},
    create: {
      id: 'claude-skill',
      title: 'Bouwen met AI',
      description: 'Ik ontwerp niet alleen, ik bouw het ook: met Claude als motor en gerichte prompts als besturing. Prompten is een vak, geen toeval. Zo lever ik een werkende site zonder externe developer.',
      icon: 'AI',
      color: '#00D752',
      order: 3
    }
  })

  console.log('Default skills created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
