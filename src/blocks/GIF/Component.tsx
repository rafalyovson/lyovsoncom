'use client'

import React, { useEffect } from 'react'
import type { GIFBlock as GIFBlockType } from './types'
import RichText from '@/components/RichText'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

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
    <Card>
      <CardContent className="pt-6">
        <div
          className="tenor-gif-embed"
          data-postid={embedCode.postId}
          data-share-method="host"
          data-aspect-ratio={embedCode.aspectRatio}
          data-width="100%"
        />
      </CardContent>

      {caption && (
        <CardFooter className="mt-6">
          <RichText content={caption} />
        </CardFooter>
      )}
    </Card>
  )
}
