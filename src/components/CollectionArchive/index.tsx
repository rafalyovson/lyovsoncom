import React from 'react'
import type { Post, Search } from '@/payload-types'
import { GridCardPost } from '@/components/grid'

export type Props = {
  posts: Post[] | Search[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <>
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return <GridCardPost key={result.slug} post={result} />
        }

        return null
      })}
    </>
  )
}
