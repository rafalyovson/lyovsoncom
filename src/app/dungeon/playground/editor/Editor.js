"use client";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

const editorConfig = {
  holder: "editorjs",
  data: {},
  tools: {
    header: Header,
    paragraph: Paragraph,
    list: List,
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
          byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides image by url
        },
      },
    },
  },
};

const EditorComponent = () => {
  const editor = new EditorJS(editorConfig);

  return (
    <>
      <div className="p-10 m-10 border border-yellow-500" id="editorjs"></div>
    </>
  );
};

export default EditorComponent;
