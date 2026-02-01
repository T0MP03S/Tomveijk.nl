const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || 'info@tomveijk.nl'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: 'Admin'
    }
  })
  
  console.log('Admin user created/updated:', user.email)
  
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
