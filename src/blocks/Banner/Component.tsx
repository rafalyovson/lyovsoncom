import type { BannerBlock as BannerBlockProps } from 'src/payload-types'
import { cn } from 'src/utilities/cn'
import React from 'react'

import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  const styleClasses = {
    info: 'border-glass-border-hover bg-glass-bg',
    error: 'border-red-400/50 bg-red-500/10 glass-bg',
    success: 'border-green-400/50 bg-green-500/10 glass-bg',
    warning: 'border-yellow-400/50 bg-yellow-500/10 glass-bg',
  }

  const iconClasses = {
    info: '💡',
    error: '⚠️',
    success: '✅',
    warning: '⚡',
  }

  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn(
          'glass-section glass-interactive border-2 py-4 px-6 flex items-start gap-4 rounded-lg backdrop-blur-md transition-all duration-300',
          styleClasses[style || 'info'],
        )}
      >
        {/* Icon indicator */}
        <div className="glass-badge rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-lg">{iconClasses[style || 'info']}</span>
        </div>

        {/* Content */}
        <div className="glass-text flex-1">
          <RichText content={content} enableGutter={false} enableProse={false} />
        </div>
      </div>
    </div>
  )
}
