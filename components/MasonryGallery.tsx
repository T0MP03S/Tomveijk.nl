'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface MasonryGalleryProps {
  images: Array<{ url: string; caption?: string }>
}

export default function MasonryGallery({ images }: MasonryGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl cursor-pointer group ${
              index % 5 === 0 ? 'row-span-2' : ''
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image.url}
              alt={image.caption || `Gallery image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].caption || `Gallery image ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {images[selectedImage].caption && (
              <p className="mt-4 text-white/80 text-center max-w-2xl">
                {images[selectedImage].caption}
              </p>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(index)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedImage
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
