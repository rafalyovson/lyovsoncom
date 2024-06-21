"use client";

import { Badge } from "@/components/ui/badge";
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
import { Post } from "@/data/types";
import { postDelete } from "@/lib/actions/post-delete";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const PostTable = ({ posts }: { posts: Post[] }) => {
  console.log("😈", posts);
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
            {posts.map((post: Post) => {
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
                  <TableCell className="font-medium">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </TableCell>
                  <TableCell>{post.author!.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {post.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell w-[100px]">
                    {post.published ? (
                      <Badge variant={"default"}>Published</Badge>
                    ) : (
                      <Badge variant={"secondary"}>Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="">
                    <section className="flex gap-2 ">
                      <Button asChild variant={"secondary"} size="icon">
                        <Link href={`/dungeon/posts/update/${post.slug}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size={"icon"}
                        onClick={() => {
                          postDelete(post);
                        }}
                        variant={"destructive"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </section>
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
