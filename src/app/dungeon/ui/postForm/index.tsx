import ContentForm from "@/app/dungeon/ui/PostForm/ContentForm";
import ImageForm from "@/app/dungeon/ui/PostForm/ImageForm";
import TitleForm from "@/app/dungeon/ui/PostForm/TitleForm";
import { Button } from "@/components/ui/button";
import { Post } from "@/data/schema";
import Link from "next/link";

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
      <ImageForm image={post?.featuredImg!} />
      <ContentForm value={post?.content} />
      <section className="flex gap-2 justify-center">
        <Button type="submit">Submit</Button>
        <Button variant={"secondary"} asChild>
          <Link href={"/dungeon"}>Cancel</Link>
        </Button>
      </section>
    </form>
  );
};

export default PostForm;
