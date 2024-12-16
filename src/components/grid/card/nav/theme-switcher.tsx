'use client'

import React from 'react'
import { SunMoon } from 'lucide-react'
import { useTheme } from '@/providers/Theme'
import { GridCardNavItem } from './grid-card-nav-item'

type ThemeSwitcherProps = {
  className?: string
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <GridCardNavItem onClick={toggleTheme} className={className}>
      <SunMoon className="w-7 h-7" />
      <span>Theme</span>
    </GridCardNavItem>
  )
}
