'use client'

import React, { useEffect } from 'react'
import type { XPostBlock as XPostBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'

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
    <div className="container my-12">
      <div className="group relative">
        <div
          className={cn(
            'w-full relative overflow-hidden rounded-xl shadow-lg transition-all duration-300',
          )}
        >
          <blockquote className="twitter-tweet" data-conversation="none">
            <a href={`https://twitter.com/x/status/${postId}`}></a>
          </blockquote>
        </div>

        {caption && (
          <div className="mt-4 text-sm text-muted-foreground">
            <RichText content={caption} />
          </div>
        )}
      </div>
    </div>
  )
}
