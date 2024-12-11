import { Input } from '@/components/ui/input'
import { GridCard } from './grid-card'
import { GridCardSection } from './grid-card-section'
import { cn } from '@/utilities/cn'
import { Button } from '@/components/ui/button'

type GridCardEmailSubscribeProps = {
  title?: string
  description?: string
  buttonText?: string
  emoji?: string
  className?: string
}

export const GridCardEmailSubscribe = ({
  title = 'Subscribe to my newsletter',
  description = 'Subscribe to my newsletter to stay up to date with my latest posts and projects.',
  buttonText = 'Subscribe',
  emoji = '👋',
  className,
}: GridCardEmailSubscribeProps) => {
  return (
    <GridCard className={cn('col-start-1 col-end-2 row-start-2 row-end-3', className)}>
      <GridCardSection
        className={`row-start-1 row-end-3 col-start-1 col-end-4 flex flex-col gap-2 items-center justify-center`}
      >
        <div className={cn('text-2xl font-bold')}>{emoji}</div>
        <h1 className={cn('text-2xl font-bold')}>{title}</h1>
        <p className={cn('text-sm text-gray-500')}>{description}</p>
      </GridCardSection>

      <GridCardSection
        className={`row-start-3 row-end-4 col-start-1 col-end-4 flex items-center justify-center gap-2`}
      >
        <Input className={cn('')} placeholder="Email" />
        <Button className={cn('')}>{buttonText}</Button>
      </GridCardSection>
    </GridCard>
  )
}
