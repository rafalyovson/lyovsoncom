import { Post, Tag, Category, User } from '@/payload-types'
import React from 'react'
import Link from 'next/link'
import { Boxes, Calendar, User as UserIcon } from 'lucide-react'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { GridCard } from '@/components/grid'

export const GridCardPost = ({ post }: { post: Post }) => {
  const {
    categories,
    tags,
    authors,
    meta: { image: metaImage } = {},
    publishedAt,
    title,
    slug,
  } = post

  return (
    <GridCard>
      {metaImage && typeof metaImage !== 'string' && (
        <Media
          imgClassName="-z-10 object-cover"
          resource={metaImage}
          className=" row-start-1 row-end-3 col-start-1 col-end-3"
        />
      )}

      <Link
        href={{ pathname: `/posts/${slug}` }}
        className={`row-start-3 row-end-4 col-start-1 col-end-4 p-2   h-full flex flex-col justify-center  border rounded-lg `}
      >
        <h1 className={`text-xl text-bold text-center `}>{title}</h1>
      </Link>

      <section
        className={`row-start-1 row-end-2 col-start-3 col-end-4   flex flex-col gap-2 p-2 justify-center border rounded-lg`}
      >
        {tags &&
          tags.map((tag: Tag) => (
            <Link
              className={` text-xs font-semibold  `}
              key={tag.id}
              href={{ pathname: `/tags/${tag.slug}` }}
            >
              <Badge variant={'default'}>{`#${tag.name}`}</Badge>
            </Link>
          ))}
      </section>

      <section
        className={`row-start-2 row-end-3 col-start-3 col-end-4 p-2 flex flex-col gap-2 justify-evenly border rounded-lg bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1c1c1e] dark:to-[#121212] `}
      >
        {authors &&
          authors.map((author: User) => (
            <Link
              href={{ pathname: `/${author.username}` }}
              className="flex items-center gap-2  "
              key={author.id}
            >
              <UserIcon className=" w-5 h-5" />
              <span className="font-medium text-xs ">{author.name}</span>
            </Link>
          ))}

        <p className="text-xs flex items-center gap-2 ">
          <Calendar className="w-5 h-5" />
          <span className="">
            {publishedAt &&
              new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
          </span>
        </p>

        {categories &&
          categories.map((category: Category) => (
            <Link
              key={category.id}
              className="flex items-center gap-2  "
              href={{ pathname: `/categories/${category.slug}` }}
            >
              <Boxes className=" w-5 h-5" />
              <span className="font-medium text-xs ">{category.name}</span>
            </Link>
          ))}
      </section>
    </GridCard>
  )
}
