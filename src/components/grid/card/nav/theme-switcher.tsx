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
    <GridCardNavItem
      onClick={toggleTheme}
      className={`row-start-3 row-end-4 col-start-3 col-end-4 ${className}`}
    >
      <SunMoon className="w-7 h-7" />
      <span className="text-sm font-medium">Theme</span>
    </GridCardNavItem>
  )
}
