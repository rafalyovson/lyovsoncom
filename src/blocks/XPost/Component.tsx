'use client'

import React, { useEffect } from 'react'

import type { XPostBlock as XPostBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

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
    <Card className="">
      <CardContent className="pt-6 flex justify-center">
        <blockquote className="twitter-tweet" data-conversation="none">
          <a href={`https://twitter.com/x/status/${postId}`}></a>
        </blockquote>
      </CardContent>

      {caption && (
        <CardFooter className="mt-6">
          <RichText content={caption} />
        </CardFooter>
      )}
    </Card>
  )
}
