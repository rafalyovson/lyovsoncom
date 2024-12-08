import { cn } from '@/utilities/cn'
import { ReactNode } from 'react'

export const GridCardSection = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) => {
  return (
    <section
      onClick={onClick}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm p-2', className)}
    >
      {children}
    </section>
  )
}
