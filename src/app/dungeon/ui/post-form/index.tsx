import { categoryGetAll } from "@/lib/actions/category-get-all";
import { tagGetAll } from "@/lib/actions/tag-get-all";
import { PostFormClient } from "./form";
export const PostForm = async ({
  post,
  action,
}: {
  post?: any;
  action: any;
}) => {
  const allCats = await categoryGetAll();
  const allTags = await tagGetAll();

  return (
    <PostFormClient
      post={post}
      action={action}
      allCats={allCats}
      allTags={allTags}
    />
  );
};
