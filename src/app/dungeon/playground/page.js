import { Suspense } from "react";
import EditorComponent from "./Editor";

const page = () => {
  return (
    <>
      <h1>Editor JS</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditorComponent />
      </Suspense>
    </>
  );
};

export default page;
