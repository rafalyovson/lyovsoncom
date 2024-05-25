import { Post } from "@/data/schema";
import { getUserById } from "@/lib/getUserById";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const TableHeader = ({ text }: { text: string }) => (
  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-dark dark:text-light">
    {text}
  </th>
);

const TableCell = ({ children }: { children: ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap dark:text-light">{children}</td>
);

const TableRow = async ({ post }: { post: Post }) => {
  const author = await getUserById(post.authorId);
  return (
    <tr
      key={post.id}
      className="transition-colors duration-200 hover:bg-dark/10 dark:hover:bg-light/10"
    >
      <TableCell>
        <Image
          alt={post.title}
          width="100"
          height="100"
          src={post.featuredImg || ""}
        />
      </TableCell>
      <TableCell>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </TableCell>
      <TableCell>{author.name}</TableCell>

      <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex gap-4 px-6 py-4 text-sm text-right whitespace-nowrap dark:text-light">
          <Link href={`/dungeon/update-post/${post.slug}`}>Update</Link>
        </div>
      </TableCell>
    </tr>
  );
};

const PostTable = ({ posts }: { posts: any }) => {
  return (
    <table className="min-w-full overflow-hidden divide-y rounded-lg dow-lg divide-dark/50 dark:divide-light">
      <thead className="bg-light dark:bg-dark">
        <tr>
          <TableHeader text="Image" />
          <TableHeader text="Title" />
          <TableHeader text="Author" />
          <TableHeader text="Date" />
          <TableHeader text="Actions" />
        </tr>
      </thead>
      <tbody className="divide-y divide-dark bg-light dark:bg-dark dark:divide-light">
        {posts.map((post: any) => (
          <TableRow key={post.id} post={post} />
        ))}
      </tbody>
    </table>
  );
};

export default PostTable;
