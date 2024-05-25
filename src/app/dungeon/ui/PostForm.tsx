import ContentForm from "@/app/dungeon/ui/postFormParts/ContentForm";
import ImageForm from "@/app/dungeon/ui/postFormParts/ImageForm";
import TitleForm from "@/app/dungeon/ui/postFormParts/TitleForm";
import Button from "@/app/ui/Button";
import { Post } from "@/data/schema";

const PostForm = ({
  post,
  action,
}: {
  post?: Post;
  action: (data: FormData) => void;
}) => {
  return (
    <form action={action} className="flex flex-col space-y-4">
      <TitleForm value={post?.title} />
      <ContentForm value={post?.content} />
      <ImageForm url={post?.featuredImg || ""} />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostForm;
