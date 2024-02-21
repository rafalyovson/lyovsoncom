"use client";
import Youtube from "@tiptap/extension-youtube";
import { Editor } from "novel";
import { useState } from "react";

export default function App() {
  const [data, setData] = useState({} as any);
  return (
    <>
      <Editor
        completionApi="/api/ai"
        className="dark:bg-dark dark:text-light"
        onDebouncedUpdate={(content) => {
          content && setData(content.getJSON());
        }}
        extensions={[Youtube]}
      />
    </>
  );
}
