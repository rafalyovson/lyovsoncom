"use client";
import { deletePost } from "@/app/lib/actions";
import Button from "@/app/ui/Button";
import { useRouter } from "next/navigation";

const DashTable = ({ posts }) => {
  const router = useRouter();
  return (
    <table className="min-w-full overflow-hidden divide-y divide-gray-200 rounded-lg shadow-lg dark:divide-light">
      <thead className="bg-gray-50 dark:bg-dark">
        <tr>
          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-light">
            Title
          </th>
          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-light">
            Author
          </th>
          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-light">
            Date
          </th>
          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-light">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark dark:divide-light">
        {posts.map((post) => (
          <tr
            key={post.id}
            className="transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <td className="px-6 py-4 whitespace-nowrap dark:text-light">
              {post.title}
            </td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-light">
              {post.author.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap dark:text-light">
              {new Date(post.createdAt).toLocaleDateString()}
            </td>
            <td className="flex gap-4 px-6 py-4 text-sm text-right whitespace-nowrap dark:text-light">
              <Button
                onClick={() =>
                  router.push(`/dashboard/update-post/${post.slug}`)
                }
              >
                Edit
              </Button>
              <Button onClick={() => deletePost(post)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DashTable;
