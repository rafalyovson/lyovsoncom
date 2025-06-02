'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import type { YouTubeBlock as YouTubeBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

const getAspectRatioClass = (ratio: string) => {
  switch (ratio) {
    case '4:3':
      return 'aspect-4/3'
    case '1:1':
      return 'aspect-square'
    default:
      return 'aspect-video' // 16:9
  }
}

const PlayButton = () => (
  <div className="group/play absolute inset-0 flex items-center justify-center z-20">
    <div className="relative">
      <div className="w-20 h-20 glass-badge glass-interactive backdrop-blur-md rounded-full border border-glass-border shadow-lg flex items-center justify-center transition-all duration-300 group-hover/play:scale-110 group-hover/play:glass-bg-hover">
        <div className="w-0 h-0 border-l-[18px] border-l-glass-text group-hover/play:border-l-glass-text-secondary border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1 transition-colors duration-300" />
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 w-20 h-20 glass-glow rounded-full opacity-0 group-hover/play:opacity-100 transition-opacity duration-300" />
    </div>
  </div>
)

export const YouTubeBlock: React.FC<YouTubeBlockType> = ({
  videoId,
  caption,
  aspectRatio = '16:9',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  if (!videoId) return null

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <Card className="glass-interactive glass-stagger-1 transition-all duration-300">
      <CardContent className="p-4">
        <div
          className={cn(
            'w-full relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 glass-media',
            getAspectRatioClass(aspectRatio!),
          )}
        >
          {!isLoaded ? (
            <button
              onClick={() => setIsLoaded(true)}
              className="w-full h-full relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-glass-border-hover focus-visible:ring-offset-2 group"
              aria-label="Play video"
            >
              {/* Glass overlay that appears on hover */}
              <div className="absolute inset-0 glass-bg opacity-0 transition-all duration-300 group-hover:opacity-30 z-10" />

              {/* Thumbnail image */}
              <div className="absolute inset-0">
                <Image
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>

              {/* Play button */}
              <PlayButton />
            </button>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
            />
          )}
        </div>
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            'glass-section rounded-lg m-4 p-2 transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2',
            'hover:shadow-md',
          )}
        >
          <RichText
            content={caption}
            className="text-sm italic text-center w-full glass-text-secondary"
          />
        </CardFooter>
      )}
    </Card>
  )
}
