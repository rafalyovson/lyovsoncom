import React from 'react'
import type { QuoteBlock as QuoteBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'

type Props = {
  className?: string
} & QuoteBlockType

export const QuoteBlock: React.FC<Props> = ({ className, quote, attribution }) => {
  return (
    <div className={cn('container my-12', className)}>
      <blockquote className="relative border-l-4 border-primary pl-4 italic">
        <div className="text-xl">
          <RichText content={quote} enableGutter={false} />
        </div>
        {attribution && (
          <footer className="mt-2 text-sm text-muted-foreground">— {attribution}</footer>
        )}
      </blockquote>
    </div>
  )
}
