'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/ui/card';

import { Post } from '@/data/types/post';
import Image from 'next/image';
import Link from 'next/link';

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Card className="bg-gradient-to-r from-[#f0f0f0] to-[#e0e0e0] dark:from-[#1c1c1e] dark:to-[#121212] text-gray-800 dark:text-gray-200 rounded-lg  overflow-hidden shadow-md  hover:shadow-lg">
      <Link href={`/posts/${post.slug}`}>
        <CardHeader className="p-0">
          <Image
            className="w-full h-48 object-cover"
            src={post.featuredImage?.url || '/placeholder-image.jpg'}
            alt={post.featuredImage?.altText || 'Post image'}
            width={400}
            height={400}
          />
        </CardHeader>

        <CardContent className="p-4">
          <CardTitle className="text-gray-800 dark:text-white text-lg font-semibold mb-2">
            {post.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
            {post.author!.name}
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};
