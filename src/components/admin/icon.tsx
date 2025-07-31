'use client'
import { useTheme } from '@payloadcms/ui'

import Image from 'next/image'

export default function AdminIcon() {
  const { autoMode, setTheme, theme } = useTheme()
  const logoSrc = theme === 'dark' ? '/crest-light-simple.webp' : '/crest-dark-simple.webp'
  return <Image src={logoSrc} alt="Lyovson.com Logo" width={200} height={200} />
}
