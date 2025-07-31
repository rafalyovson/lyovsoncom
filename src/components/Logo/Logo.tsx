'use client'

import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'

interface Props {
  className?: string
}

export const Logo = (props: Props) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  let src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  if (mounted) {
    switch (resolvedTheme) {
      case 'light':
        src = '/crest-dark-simple.webp'
        break
      case 'dark':
        src = '/crest-light-simple.webp'
        break
      default:
        src = '/crest-dark-simple.webp'
        break
    }
  }

  return (
    <Image
      alt="Lyovson.com Logo"
      width={150}
      height={150}
      className={clsx('', props.className)}
      src={src}
    />
  )
}
