import React from 'react'

import type { QuoteBlock as QuoteBlockType } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'

type Props = {
  className?: string
} & QuoteBlockType

export const QuoteBlock: React.FC<Props> = ({ className, quote, attribution }) => {
  return (
    <div className={cn('container ', className)}>
      <blockquote className="glass-section glass-premium relative border-l-4 border-glass-border-hover pl-6 py-6  mt-0 mb-0 italic rounded-lg">
        <div className="text-xl glass-text-secondary leading-relaxed">
          <RichText content={quote} enableGutter={false} />
        </div>
        {attribution && (
          <footer className="mt-4 text-sm glass-text-secondary opacity-80 font-medium">
            — {attribution}
          </footer>
        )}
        {/* Glass decorative element */}
        <div className="absolute top-4 right-4 w-8 h-8 glass-badge rounded-full flex items-center justify-center">
          <span className="text-glass-text-secondary text-lg">&ldquo;</span>
        </div>
      </blockquote>
    </div>
  )
}
