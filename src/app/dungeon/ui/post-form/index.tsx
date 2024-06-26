import { categoriesGetAll } from "@/lib/actions/categories-get-all";
import { usersGetAll } from "@/lib/actions/users-get-all";
import { PostFormClient } from "./form";
export const PostForm = async ({
  post,
  action,
}: {
  post?: any;
  action: any;
}) => {
  const allCats = await categoriesGetAll();
  const authors = await usersGetAll();

  return (
    <PostFormClient
      post={post}
      action={action}
      allCats={allCats}
      authors={authors}
    />
  );
};
