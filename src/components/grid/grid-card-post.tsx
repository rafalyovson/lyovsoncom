import { Post } from '@/data/types';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Boxes, Calendar, User } from 'lucide-react';
import { Category, Tag } from '@/data/schema';
import { Badge } from '@/components/shadcn/ui/badge';
import { GridCard } from '@/components/grid/grid-card';

export const GridCardPost = ({ post }: { post: Post }) => {
  return (
    <GridCard>
      <Image
        src={post.featuredImage?.url || '/placeholder-image.jpg'}
        alt={post.featuredImage?.altText || 'Post image'}
        width={400}
        height={400}
        className={`row-start-1 row-end-3 col-start-1 col-end-3 object-cover w-full h-full  rounded-lg`}
      />
      <Link
        href={{ pathname: `/posts/${post.slug}` }}
        className={`row-start-3 row-end-4 col-start-1 col-end-4 p-2   h-full flex flex-col justify-center  border rounded-lg `}
      >
        <h1 className={`text-xl text-bold text-center `}>{post.title}</h1>
      </Link>

      <section
        className={`row-start-1 row-end-2 col-start-3 col-end-4   flex flex-col gap-2 p-2 justify-center border rounded-lg`}
      >
        {post.tags!.map((tag: Tag) => (
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
        <Link
          href={{ pathname: `/${post.author!.username}` }}
          className="flex items-center gap-2  "
        >
          <User className=" w-5 h-5" />
          <span className="font-medium text-xs ">{post.author!.name}</span>
        </Link>

        <p className="text-xs flex items-center gap-2 ">
          <Calendar className="w-5 h-5" />
          <span className="">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </p>

        {post.categories!.map((category: Category) => (
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
  );
};
