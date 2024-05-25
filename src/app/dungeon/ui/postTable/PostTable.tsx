"use client";

import { deletePost } from "@/app/dungeon/lib/postActions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostWithUser } from "@/lib/getAllPosts";
import Image from "next/image";

const PostTable = ({
  allPostsWithUsers,
}: {
  allPostsWithUsers: PostWithUser[];
}) => {
  return (
    <Table className="min-h-screen">
      <TableCaption>All Articles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-b">
        {allPostsWithUsers.map((postwithuser: PostWithUser) => {
          const { post, user } = postwithuser;
          return (
            <TableRow key={post.id}>
              <TableCell>
                <Image
                  src={post.featuredImg || ""}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="w-[150px] aspect-square object-cover"
                />
              </TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{user?.name}</TableCell>
              <TableCell>{post.published}</TableCell>
              <TableCell className=" flex flex-col gap-2 justify-center w-[200px]">
                <Button>Edit</Button>
                <Button
                  onClick={() => {
                    deletePost(post);
                  }}
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PostTable;
