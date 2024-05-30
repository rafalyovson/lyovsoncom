import ContentForm from "@/app/dungeon/ui/PostForm/ContentForm";
import ImageForm from "@/app/dungeon/ui/PostForm/ImageForm";
import TitleForm from "@/app/dungeon/ui/PostForm/TitleForm";
import { Button } from "@/components/ui/button";
import { Post } from "@/data/schema";

const PostForm = ({
  post,
  action,
}: {
  post?: Post;
  action: (data: FormData) => void;
}) => {
  return (
    <form action={action} className="flex flex-col  space-y-4 gap-4">
      <TitleForm value={post?.title} />
      <ImageForm />
      <ContentForm value={post?.content} />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostForm;
