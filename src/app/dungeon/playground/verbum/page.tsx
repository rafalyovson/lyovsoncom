"use client";

import { FC } from "react";
import {
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  Divider,
  Editor,
  EditorComposer,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  ToolbarPlugin,
  UnderlineButton,
} from "verbum";

// version mismatch between my lexical and theirs lol
import { $generateHtmlFromNodes } from "../../../../../node_modules/verbum/node_modules/@lexical/html";

const NoteViewer: FC = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return (
    <EditorComposer>
      <Editor
        actionsEnabled={true}
        hashtagsEnabled={true}
        onChange={(state, editor) => {
          if (editor) {
            editor.update(() => {
              console.log($generateHtmlFromNodes(editor));
            });
          }
        }}
      >
        <ToolbarPlugin
          defaultFontSize="20px"
          defaultBgColor="transparent"
          defaultFontColor="rgb(15 23 42/ var(--tw-bg-opacity))"
        >
          <FontFamilyDropdown />
          <FontSizeDropdown />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown
            enableImage={{ enable: true, maxWidth: 400 }}
            enablePoll={true}
            enableYoutube={true}
            enableTwitter={true}
          />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default NoteViewer;

// const page = () => {
//   return <div>page</div>;
// };

// export default page;
