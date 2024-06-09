import { Editor } from "./Editor";
import "./styles.css";

const page = () => {
  return (
    <article className="flex gap-2">
      {/* <section>
        <Input />
        <Input />
      </section> */}
      <Editor />
    </article>
  );
};

export default page;
