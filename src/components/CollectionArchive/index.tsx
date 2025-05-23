import React from 'react'

import type { Post } from '@/payload-types'
import { GridCardPost } from '@/components/grid'

export type Props = {
  posts: Post[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <>
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <GridCardPost
              key={result.slug}
              post={result}
              {...(index === 0 && {
                loading: 'eager',
                fetchPriority: 'high',
                priority: true,
              })}
            />
          )
        }

        return null
      })}
    </>
  )
}
