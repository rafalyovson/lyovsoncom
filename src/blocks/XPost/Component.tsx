'use client'

import React, { useEffect } from 'react'

import type { XPostBlock as XPostBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const XPostBlock: React.FC<XPostBlockType> = ({ postId, caption }) => {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (!postId) return null

  return (
    <Card className="glass-interactive glass-stagger-2 transition-all duration-300">
      <CardContent className="pt-6 flex justify-center">
        <div className="w-full max-w-lg">
          <blockquote
            className="twitter-tweet glass-interactive transition-all duration-300"
            data-conversation="none"
            data-theme="light"
          >
            <a href={`https://twitter.com/x/status/${postId}`} className="glass-text">
              View this post on X
            </a>
          </blockquote>
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
