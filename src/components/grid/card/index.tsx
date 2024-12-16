import React, { ReactNode } from 'react'
import { Card } from '../../ui/card'
import { cn } from '@/utilities/cn'

export const GridCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <Card
      className={cn(
        'grid grid-cols-3 grid-rows-3  w-[400px] h-[400px] aspect-square gap-2 p-2',
        className,
      )}
    >
      {children}
    </Card>
  )
}
