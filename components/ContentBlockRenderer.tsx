'use client'

import Image from 'next/image'
import Link from 'next/link'
import MasonryGallery from './MasonryGallery'
import ImageSlider from './ImageSlider'

interface ContentBlock {
  id: string
  type: string
  content: string
  order: number
}

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
}

function getEmbedUrl(url: string): string {
  // YouTube watch URL -> embed URL
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v')
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
  }
  // YouTube short URL -> embed URL
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0]
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`
    }
  }
  // Vimeo URL -> embed URL
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`
    }
  }
  // Already an embed URL or other format
  return url
}

export default function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        const content = typeof block.content === 'string' ? JSON.parse(block.content) : block.content

        switch (block.type) {
          case 'PHOTO':
            return (
              <div key={block.id} className="rounded-2xl overflow-hidden border border-white/10">
                <div className="relative w-full aspect-video">
                  <Image
                    src={content.url}
                    alt={content.caption || 'Photo'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                </div>
                {content.caption && (
                  <p className="p-4 text-white/60 text-sm">{content.caption}</p>
                )}
              </div>
            )

          case 'VIDEO':
            const isEmbedVideo = content.url.includes('youtube.com') || content.url.includes('youtu.be') || content.url.includes('vimeo.com')
            const embedUrl = isEmbedVideo ? getEmbedUrl(content.url) : content.url
            return (
              <div key={block.id} className="rounded-2xl overflow-hidden border border-white/10">
                {isEmbedVideo ? (
                  <div className="relative w-full aspect-video">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      title={content.caption || 'Video'}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <video controls className="w-full">
                    <source src={content.url} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {content.caption && (
                  <p className="p-4 text-white/60 text-sm">{content.caption}</p>
                )}
              </div>
            )

          case 'LINK':
            return (
              <Link
                key={block.id}
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                {content.text || content.url}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )

          case 'TITLE':
            return (
              <h2 key={block.id} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] bg-clip-text text-transparent">
                {content.text}
              </h2>
            )

          case 'SUBTITLE':
            return (
              <h3 key={block.id} className="text-2xl md:text-3xl font-semibold text-white/90">
                {content.text}
              </h3>
            )

          case 'TEXT':
            return (
              <div key={block.id} className="prose prose-invert max-w-none">
                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                  {content.text}
                </p>
              </div>
            )

          case 'WEBSITE':
            if (content.type === 'popup') {
              return (
                <div key={block.id}>
                  <Link
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-colors"
                  >
                    Open website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              )
            }
            return (
              <div key={block.id} className="rounded-2xl overflow-hidden border border-white/10">
                <div className="relative w-full aspect-video">
                  <iframe
                    src={content.url}
                    className="w-full h-full"
                    title="Website embed"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )

          case 'GALLERY':
            return (
              <div key={block.id}>
                <MasonryGallery images={content.images || []} />
              </div>
            )

          case 'SLIDER':
            return (
              <div key={block.id}>
                <ImageSlider images={content.images || []} />
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
