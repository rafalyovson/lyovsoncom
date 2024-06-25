import { categoriesGetAll } from "@/lib/actions/categories-get-all";
import { PostFormClient } from "./form";
export const PostForm = async ({
  post,
  action,
}: {
  post?: any;
  action: any;
}) => {
  const allCats = await categoriesGetAll();

  return <PostFormClient post={post} action={action} allCats={allCats} />;
};
