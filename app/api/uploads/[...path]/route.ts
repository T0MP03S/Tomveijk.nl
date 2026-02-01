import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads')

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filename = params.path.join('/')
    const filePath = path.join(UPLOAD_DIR, filename)

    // Security: prevent directory traversal
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const file = await fs.readFile(filePath)
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase()
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
