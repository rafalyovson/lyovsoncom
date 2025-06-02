'use client'

import React, { useEffect } from 'react'

import type { GIFBlock as GIFBlockType } from './types'

import RichText from '@/components/RichText'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const GIFBlock: React.FC<GIFBlockType> = ({ embedCode, caption }) => {
  useEffect(() => {
    // Load Tenor embed script
    const script = document.createElement('script')
    script.src = 'https://tenor.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (!embedCode?.postId) return null

  return (
    <Card className="glass-interactive glass-stagger-1 transition-all duration-300 py-0">
      <CardContent className="px-0">
        <div className="glass-media overflow-hidden rounded-lg">
          <div
            className="tenor-gif-embed glass-interactive transition-all duration-300 "
            data-postid={embedCode.postId}
            data-share-method="host"
            data-aspect-ratio={embedCode.aspectRatio}
            data-width="100%"
          />
        </div>
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            'glass-section rounded-lg p-2 transition-all duration-300',
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
