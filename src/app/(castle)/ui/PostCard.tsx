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

const PostCard = ({ postWithUser }: { postWithUser: PostWithUser }) => {
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
          <CardTitle>
            <h2 className="text-lg font-bold capitalize">{post.title}</h2>
          </CardTitle>
          <CardDescription>
            <p>{user?.name}</p>
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PostCard;
