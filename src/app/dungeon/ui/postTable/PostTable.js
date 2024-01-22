"use client";
import { deletePost } from "@/app/dungeon/lib/postActions";
import Button from "@/app/ui/Button";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TableHeader = ({ text }) => (
  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-dark dark:text-light">
    {text}
  </th>
);

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap dark:text-light">{children}</td>
);

const TableRow = ({ post, router }) => (
  <tr
    key={post.id}
    className="transition-colors duration-200 hover:bg-dark/10 dark:hover:bg-light/10"
  >
    <TableCell>
      <Image alt={post.title} width="100" height="100" src={post.featuredImg} />
    </TableCell>
    <TableCell>
      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
    </TableCell>
    <TableCell>{post.author.name}</TableCell>

    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
    <TableCell>
      <div className="flex gap-4 px-6 py-4 text-sm text-right whitespace-nowrap dark:text-light">
        <Button
          aria-label="update the post"
          className="flex items-center justify-center rounded-full size-12"
          onClick={() => router.push(`/dungeon/update-post/${post.slug}`)}
        >
          <FontAwesomeIcon icon={faPenToSquare} className="rounded-full" />
        </Button>
        <Button
          aria-label="delete the post"
          className="flex items-center justify-center rounded-full size-12"
          onClick={() => deletePost(post)}
        >
          <FontAwesomeIcon icon={faTrash} className="rounded-full" />
        </Button>
      </div>
    </TableCell>
  </tr>
);

const PostTable = ({ posts }) => {
  const router = useRouter();
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
        {posts.map((post) => (
          <TableRow key={post.id} post={post} router={router} />
        ))}
      </tbody>
    </table>
  );
};

export default PostTable;
