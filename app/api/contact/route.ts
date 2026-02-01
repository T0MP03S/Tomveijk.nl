import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  message: z.string().min(1, 'Bericht is verplicht'),
  website: z.string().optional(), // Honeypot field
})

// Simple in-memory rate limiting (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // Max 3 messages per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true
  }
  
  record.count++
  return false
}

async function sendEmailNotification(name: string, email: string, message: string) {
  const SMTP_HOST = process.env.SMTP_HOST
  const SMTP_PORT = process.env.SMTP_PORT
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const CONTACT_EMAIL = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
    console.log('Email not configured, skipping notification')
    return
  }

  try {
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587'),
      secure: SMTP_PORT === '465',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      subject: `Nieuw contactbericht van ${name}`,
      html: `
        <h2>Nieuw contactbericht</h2>
        <p><strong>Naam:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Bericht:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email,
    })

    console.log('Email notification sent to:', CONTACT_EMAIL)
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
}

export async function POST(request: Request) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limit
    if (isRateLimited(ip)) {
      console.log('Rate limited:', ip)
      return NextResponse.json(
        { error: 'Te veel berichten. Probeer het later opnieuw.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    const { name, email, message, website } = validatedData

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      console.log('Honeypot triggered, blocking spam')
      // Return success to not alert the bot, but don't save
      return NextResponse.json({ success: true, id: 'blocked' })
    }

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    })

    console.log('Contact message saved:', contactMessage.id)

    // Send email notification (async, don't wait)
    sendEmailNotification(name, email, message)

    return NextResponse.json({ success: true, id: contactMessage.id })
  } catch (error) {
    console.error('Contact form error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
