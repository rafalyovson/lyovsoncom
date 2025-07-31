'use client'
import { useTheme } from '@payloadcms/ui'

import Image from 'next/image'

export default function AdminLogo() {
  const { autoMode, setTheme, theme } = useTheme()
  const logoSrc = theme === 'dark' ? '/crest-light-simple.webp' : '/crest-dark-simple.webp'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Image src={logoSrc} alt="Lyovson.com Logo" width={200} height={200} />
      <span
        style={{
          color: theme === 'dark' ? 'white' : 'black',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        Lyovson.com
      </span>
    </div>
  )
}
