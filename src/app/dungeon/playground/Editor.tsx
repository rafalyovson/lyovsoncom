"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { useState } from "react";
import { AutoEmbedPlugin } from "./plugins/auto-embed-plugin";
import { AutoLinkPlugin } from "./plugins/auto-link-plugin";
import { CodeHighlightPlugin } from "./plugins/code-highlight-plugin";
import { ComponentPickerPlugin } from "./plugins/component-picker-plugin";
import { FloatingTextFormatToolbarPlugin } from "./plugins/floating-text-format-tool-plugin";
import { ImageNode, ImagesPlugin } from "./plugins/images-plugin";
import { ListMaxIndentLevelPlugin } from "./plugins/list-max-indent-level-plugin";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import { TweetNode, TwitterPlugin } from "./plugins/x-plugin";
import { YouTubeNode, YouTubePlugin } from "./plugins/youtube-plugin";
import { defaultTheme } from "./themes/default-theme";

const editorConfig = {
  namespace: "Playground",
  theme: defaultTheme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    YouTubeNode,
    TweetNode,
    ImageNode,
  ],
};

export const Editor = () => {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) {
      setFloatingAnchorElem(floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className=" border w-full max-w-[600px] mx-auto rounded-md">
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        {floatingAnchorElem && (
          <>
            {/* <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            /> */}
            <FloatingTextFormatToolbarPlugin
              isLinkEditMode={isLinkEditMode}
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}

        <div className=" rounded-b-md">
          <RichTextPlugin
            contentEditable={
              <div className="outline-none " ref={onRef}>
                <ContentEditable className="p-4 border outline-ring prose dark:prose-invert h-96 overflow-y-scroll" />
              </div>
            }
            placeholder={<></>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ImagesPlugin />
        <AutoFocusPlugin />
        <CodeHighlightPlugin />
        <ListPlugin />
        <ComponentPickerPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <AutoEmbedPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </LexicalComposer>
  );
};
