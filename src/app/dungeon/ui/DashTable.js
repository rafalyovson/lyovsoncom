"use client";
import { deletePost } from "@/app/lib/actions";
import Button from "@/app/ui/Button";
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
    <TableCell>{post.title}</TableCell>
    <TableCell>{post.author.name}</TableCell>
    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
    <TableCell>
      <div className="flex gap-4 px-6 py-4 text-sm text-right whitespace-nowrap dark:text-light">
        <Button
          onClick={() => router.push(`/dashboard/update-post/${post.slug}`)}
        >
          Edit
        </Button>
        <Button onClick={() => deletePost(post)}>Delete</Button>
      </div>
    </TableCell>
  </tr>
);

const DashTable = ({ posts }) => {
  const router = useRouter();
  return (
    <table className="min-w-full overflow-hidden divide-y rounded-lg dow-lg divide-dark/50 dark:divide-light">
      <thead className="bg-light dark:bg-dark">
        <tr>
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

export default DashTable;
