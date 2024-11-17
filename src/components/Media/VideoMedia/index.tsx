'use client'

import { cn } from 'src/utilities/cn'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // Handle suspend event if needed
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    // Use the full URL from the resource if available, otherwise construct it
    const videoUrl = resource.url
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/${resource.url}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${resource.filename}`

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={videoUrl} type={resource.mimeType || 'video/mp4'} />
      </video>
    )
  }

  return null
}
