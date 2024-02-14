"use client";
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
      />
      <h2>damn</h2>
      {data.content.map((block: any) => {
        return <div key={block.text}>{block.text}</div>;
      })}
    </>
  );
}
