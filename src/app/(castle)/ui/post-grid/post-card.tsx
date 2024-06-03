"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PostWithUser } from "@/lib/getAllPosts";
import Image from "next/image";
import Link from "next/link";

export const PostCard = ({ postWithUser }: { postWithUser: PostWithUser }) => {
  console.log(postWithUser);
  const { post, user } = postWithUser;
  return (
    <Card>
      <Link href={`/posts/${post.slug}`}>
        <CardHeader>
          <Image
            src={post.featuredImg || "/images/placeholder.png"}
            alt={post.title + " featured image"}
            width="400"
            height="400"
          />
        </CardHeader>

        <CardContent>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>{user?.name}</CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};
