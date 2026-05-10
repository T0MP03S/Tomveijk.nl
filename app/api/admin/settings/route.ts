import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For now, return default settings
    // In a real app, you might store these in a database
    const defaultSettings = {
      siteTitle: 'Tom van Eijk - Creative Designer',
      siteDescription: 'Grafisch vormgever met passie voor innovatie. Gespecialiseerd in logo design, huisstijlen en creatieve designs.',
      contactEmail: 'info@tomveijk.nl',
      socialInstagram: 'https://www.instagram.com/tompoeso',
      socialLinkedin: 'https://www.linkedin.com/in/tomveijknl/',
      socialTiktok: 'https://www.tiktok.com/@tompoeso',
      socialTwitch: 'https://www.twitch.tv/t0mp03s',
      socialYoutube: 'https://www.youtube.com/@Tompoeso',
      metaTitle: 'Tom van Eijk - Creative Designer & Grafisch Vormgever',
      metaDescription: 'Portfolio van Tom van Eijk - Creative Designer. Gespecialiseerd in logo design, huisstijlen, branding en grafische vormgeving.',
    }

    return NextResponse.json(defaultSettings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await request.json()

    // For now, just return success
    // In a real app, you would save these to a database
    console.log('Settings saved:', settings)

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
