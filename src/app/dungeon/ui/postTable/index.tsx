"use client";

import { deletePost } from "@/app/dungeon/lib/postActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostWithUser } from "@/lib/getAllPosts";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PostTable = ({
  allPostsWithUsers,
}: {
  allPostsWithUsers: PostWithUser[];
}) => {
  return (
    <Card className="flex-grow">
      <CardHeader className="px-7">
        <CardTitle>Posts</CardTitle>
        <CardDescription>All of the posts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] hidden md:table-cell">
                Image
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="hidden sm:table-cell w-[100px]">
                Status
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPostsWithUsers.map((postwithuser: PostWithUser) => {
              const { post, user } = postwithuser;
              return (
                <TableRow key={post.id}>
                  <TableCell className="w-[120px]">
                    <Image
                      className="w-[100px] aspect-square object-cover"
                      src={post.featuredImg || ""}
                      alt={post.title}
                      width={200}
                      height={200}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{user?.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {post.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell w-[100px]">
                    {post.published}
                  </TableCell>
                  <TableCell className=" flex flex-col gap-2 w-[100px]  items-end">
                    <Button asChild variant={"secondary"}>
                      <Link href={`/dungeon/update-post/${post.slug}`}>
                        <Edit />
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        deletePost(post);
                      }}
                      variant={"destructive"}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PostTable;
