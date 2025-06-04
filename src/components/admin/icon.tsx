'use client'
import { useTheme } from '@payloadcms/ui'

import Image from 'next/image'

export default function AdminIcon() {
  const { autoMode, setTheme, theme } = useTheme()
  const logoSrc = theme === 'dark' ? '/logo-white.webp' : '/logo-black.webp'
  return <Image src={logoSrc} alt="Lyovson.com Logo" width={200} height={200} />
}
