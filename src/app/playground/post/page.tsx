import { GridCardHeader, GridCardHero } from '@/components/grid'

import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'
import { GridCardPost } from '@/components/grid'
import testPost from './test-post.json'

export default async function Post() {
  const post = testPost
  return (
    <>
      <GridCardHeader className=" g2:col-start-1 g2:col-end-2 g2:row-start-1 g2:row-end-2 max-w-[400px]" />
      <GridCardHero
        post={post}
        className="g2:col-start-2 g2:col-end-3 g2:row-start-1 g2:row-end-2 max-w-[400px]"
      />

      <div className=" g2:col-start-2 g2:col-end-4 g2:row-start-2 g2:row-end-6  self-stretch ">
        <RichText className="h-full" content={post.content} enableGutter={true} />
      </div>

      {post.relatedPosts &&
        post.relatedPosts.length > 0 &&
        post.relatedPosts.map((doc, index) => {
          return (
            <GridCardPost
              key={index}
              post={doc as Post}
              className={` g2:col-start-1 g2:col-end-2 g2:row-start-${index + 2} g2:row-end-${index + 3} g4:col-start-4 g4:col-end-5 g4:row-start-${index + 1} g4:row-end-${index + 2} max-w-[400px]`}
            />
          )
        })}
    </>
  )
}
