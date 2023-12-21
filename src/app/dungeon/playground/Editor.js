"use client";
import EditorToolbar from "@/app/dungeon/playground/EditorToolbar";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot, $getSelection } from "lexical";

function onChange(state) {
  state.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
    console.log(selection);
  });
}

const Editor = () => {
  return (
    <div className="relative bg-red-300 rounded-sm">
      <LexicalComposer
        initialConfig={{
          theme: {
            paragraph: "mb-1", // tailwind classes work!
          },
          onError(error) {
            throw error;
          },
        }}
      >
        <EditorToolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="h-[450px] outline-none py-[15px] px-2.5 resize-none overflow-hidden text-ellipsis" />
          }
          placeholder={
            <div className="absolute top-[15px] left-[10px] pointer-events-none select-none">
              Now write something brilliant...
            </div>
          }
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

export default Editor;
