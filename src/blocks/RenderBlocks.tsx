import React, { Fragment } from 'react'

import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { YouTubeBlock } from '@/blocks/YouTube/Component'
import { GIFBlock } from '@/blocks/GIF/Component'

type BlockType = 'mediaBlock' | 'youtube' | 'gif'

interface BlockWithType {
  blockType: BlockType
  [key: string]: any
}

const blockComponents = {
  mediaBlock: MediaBlock,
  youtube: YouTubeBlock,
  gif: GIFBlock,
}

export const RenderBlocks = (props: { blocks: BlockWithType[] }) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            return (
              <div className="my-16" key={index}>
                {blockType === 'mediaBlock' && <MediaBlock {...(block as any)} />}
                {blockType === 'youtube' && <YouTubeBlock {...(block as any)} />}
                {blockType === 'gif' && <GIFBlock {...(block as any)} />}
              </div>
            )
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
