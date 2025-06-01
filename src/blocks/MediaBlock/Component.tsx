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
    <article className=" border rounded-lg p-2  flex flex-col gap-2 bg-card">
      <section className="p-2 border rounded-lg">
        <Media
          imgClassName={cn('border border-border rounded-lg ', imgClassName)}
          resource={media}
          src={staticImage}
        />
      </section>
      {caption && (
        <section className="border rounded-lg p-2">
          <RichText content={caption} enableGutter={false} className={`italic`} />
        </section>
      )}
    </article>
  )
}
