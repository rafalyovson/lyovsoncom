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
        src = '/logo-black.webp'
        break
      case 'dark':
        src = '/logo-white.webp'
        break
      default:
        src = '/logo-black.webp'
        break
    }
  }

  return (
    /* eslint-disable @next/next/no-img-element */
    <Image
      alt="Lyovson.com Logo"
      width={100}
      height={100}
      className={clsx('', props.className)}
      src={src}
    />
  )
}
