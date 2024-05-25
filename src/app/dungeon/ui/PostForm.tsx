import ContentForm from "@/app/dungeon/ui/postFormParts/ContentForm";
import ImageForm from "@/app/dungeon/ui/postFormParts/ImageForm";
import TitleForm from "@/app/dungeon/ui/postFormParts/TitleForm";
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
      <section className="flex flex-col lg:flex-row justify-between gap-8">
        <section className="w-full flex flex-col justify-evenly lg:max-w-[50%] gap-8">
          <TitleForm value={post?.title} />
        </section>
        <section className="flex flex-col w-full lg:max-w-[50%]">
          <ImageForm />
        </section>
      </section>
      <ContentForm value={post?.content} />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostForm;
