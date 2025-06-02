import type { StaticImageData } from 'next/image'
import { cn } from 'src/utilities/cn'
import React from 'react'

import RichText from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <Card
      className={cn(
        'glass-interactive glass-stagger-1 transition-all duration-300 ',

        className,
      )}
    >
      <CardContent className={cn('p-0', className)}>
        <Media
          imgClassName={cn('object-cover h-full ', imgClassName)}
          resource={media}
          src={staticImage}
          className="h-full  flex justify-center items-center"
          pictureClassName="mt-0 mb-0"
        />
      </CardContent>
      {caption && (
        <CardFooter
          className={cn(
            'glass-section rounded-lg p-2 transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2',
            'hover:shadow-md',
          )}
        >
          <RichText
            content={caption}
            enableGutter={false}
            className={cn(
              'text-sm italic text-center w-full glass-text-secondary',
              captionClassName,
            )}
          />
        </CardFooter>
      )}
    </Card>
  )
}
