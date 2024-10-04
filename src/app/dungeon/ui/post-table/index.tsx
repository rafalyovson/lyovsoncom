'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Post } from '@/data/types/post';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { postDeleteAction } from '@/lib/actions/server-actions/post/post-delete-action';
import { useActionState } from 'react';
import { toast } from 'sonner';

export const PostTable = ({ posts }: { posts: Post[] }) => {
  const [state, formAction, isPending] = useActionState(postDeleteAction, {
    message: '',
    success: false,
  });

  if (state.success) {
    toast.success(state.message);
    state.success = false;
    state.message = '';
  }

  return (
    <Card className="flex-grow bg-gradient-to-r from-[#1c1c1e] to-[#121212] rounded-xl shadow-lg p-6">
      <CardContent>
        <Table className="w-full text-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] hidden md:table-cell text-gray-400">
                Image
              </TableHead>
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Author</TableHead>
              <TableHead className="hidden md:table-cell text-gray-400">
                Date
              </TableHead>
              <TableHead className="hidden sm:table-cell w-[100px] text-gray-400">
                Status
              </TableHead>
              <TableHead className="w-[100px] text-right text-gray-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post: Post) => {
              return (
                <TableRow
                  key={post.id}
                  className="hover:bg-[#2c2c2e] transition-colors"
                >
                  <TableCell className="w-[120px] hidden md:table-cell">
                    <Image
                      className="w-full h-auto object-cover rounded-lg shadow-sm"
                      src={post.featuredImage?.url || '/placeholder-image.jpg'}
                      alt={post.featuredImage?.altText || 'Post image'}
                      width={120}
                      height={120}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    <Link
                      href={`/dungeon/posts/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {post.author!.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-300">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell w-[100px]">
                    {post.published ? (
                      <Badge
                        variant={'default'}
                        className="bg-primary text-background rounded-full py-1 px-3"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant={'secondary'}
                        className="bg-[#3a3a3c] text-gray-300 rounded-full py-1 px-3"
                      >
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <section className="flex gap-2 justify-end">
                      <Button
                        asChild
                        variant={'secondary'}
                        size="icon"
                        className="hover:bg-primary/80"
                      >
                        <Link href={`/dungeon/posts/update/${post.slug}`}>
                          <Edit className="h-4 w-4 text-white" />
                        </Link>
                      </Button>
                      <form action={formAction} method="post">
                        <input type="hidden" name="id" value={post.id} />
                        <Button
                          disabled={isPending}
                          size={'icon'}
                          variant={'destructive'}
                          className="hover:bg-red-700/80"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </form>
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
