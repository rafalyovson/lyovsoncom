"use client";
import { Editor } from "novel";

export default function App() {
  return (
    <Editor
      completionApi="/api/ai"
      className="dark:bg-dark dark:text-light"
      onDebouncedUpdate={(data) => {
        console.log(data.getHTML());
      }}
    />
  );
}
