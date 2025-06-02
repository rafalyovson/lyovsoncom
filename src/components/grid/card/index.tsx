import React, { ReactNode } from 'react'

import { cn } from '@/utilities/cn'

export const GridCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div
      role="article"
      tabIndex={0}
      className={cn(
        'grid grid-cols-3 grid-rows-3 w-[400px] h-[400px] aspect-square gap-2 p-2',
        'glass-card rounded-xl glass-interactive',
        className,
      )}
    >
      {children}
    </div>
  )
}
