"use client";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

const editorConfig = {
  holder: "editorjs",
  data: {},
  tools: {
    header: Header,
  },
};
const EditorComponent = () => {
  const editor = new EditorJS(editorConfig);

  return (
    <>
      <div id="editorjs"></div>
    </>
  );
};

export default EditorComponent;
