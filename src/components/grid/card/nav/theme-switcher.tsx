'use client'

import React, { useEffect, useState } from 'react'
import { SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { GridCardNavItem } from './grid-card-nav-item'

type ThemeSwitcherProps = {
  className?: string
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <GridCardNavItem onClick={toggleTheme} className={className}>
      <SunMoon className="w-7 h-7" />
      <span>Theme</span>
    </GridCardNavItem>
  )
}
