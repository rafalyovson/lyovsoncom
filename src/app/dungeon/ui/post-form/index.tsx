import { categoriesGetAll } from "@/lib/actions/categories-get-all";
import { tagsGetAll } from "@/lib/actions/tags-get-all";
import { PostFormClient } from "./form";
export const PostForm = async ({
  post,
  action,
}: {
  post?: any;
  action: any;
}) => {
  const allCats = await categoriesGetAll();
  const allTags = await tagsGetAll();

  return (
    <PostFormClient
      post={post}
      action={action}
      allCats={allCats}
      allTags={allTags}
    />
  );
};
