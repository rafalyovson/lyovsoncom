import { cn } from '@/utilities/cn'
import { ReactNode } from 'react'

export const GridCardSection = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <section
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm p-2', className)}
    >
      {children}
    </section>
  )
}
