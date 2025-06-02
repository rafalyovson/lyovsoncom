import { ReactNode } from 'react'

import { cn } from '@/utilities/cn'

type GridCardSectionProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  interactive?: boolean
}

export const GridCardSection = ({
  children,
  className,
  onClick,
  interactive,
}: GridCardSectionProps) => {
  const isInteractive = interactive || !!onClick

  return (
    <section
      onClick={onClick}
      className={cn(
        'glass-section rounded-lg p-2 transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2',
        'hover:shadow-md',
        isInteractive && 'cursor-pointer glass-interactive',
        className,
      )}
      {...(isInteractive && {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        },
      })}
    >
      {children}
    </section>
  )
}
