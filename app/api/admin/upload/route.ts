import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sanitizeFilename, ensureUploadDir } from '@/lib/upload'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads')

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as Blob | null

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileType = (file as any).type || ''
    const fileName = (file as any).name || 'upload.jpg'

    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are supported' }, { status: 400 })
    }

    await ensureUploadDir()

    const sanitized = sanitizeFilename(fileName)
    const timestamp = Date.now()
    const filename = `${timestamp}-${sanitized}`
    const filePath = path.join(UPLOAD_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    const url = `/api/uploads/${filename}`

    return NextResponse.json({
      success: true,
      original: url,
      thumbnail: url,
      medium: url
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
