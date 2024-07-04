'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Post } from '@/data/types/post';
import Image from 'next/image';
import Link from 'next/link';

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Card>
      <Link href={`/posts/${post.slug}`}>
        <CardHeader>
          <Image
            className="rounded-md aspect-square"
            src={post.featuredImage?.url || ''}
            alt={post.featuredImage?.altText || ''}
            width="400"
            height="400"
          />
        </CardHeader>

        <CardContent>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{post.author!.name}</CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};
