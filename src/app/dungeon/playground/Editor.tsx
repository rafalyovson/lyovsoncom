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
import { FigmaNode, FigmaPlugin } from "./plugins/figma-plugin";
import { FloatingLinkEditorPlugin } from "./plugins/flaoting-link-editor-plugin";
import { FloatingTextFormatToolbarPlugin } from "./plugins/floating-text-format-tool-plugin";
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
    FigmaNode,
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
      <h1>{isLinkEditMode ? "edit mode" : " non-edit-mode"}</h1>
      <div className=" border w-full max-w-[600px] mx-auto">
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        {floatingAnchorElem && (
          <>
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}

        <div className="">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="editor-input" />
                </div>
              </div>
            }
            placeholder={
              <div className="editor-placeholder">Enter some rich text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />

          {/* <TreeViewPlugin /> */}
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <AutoEmbedPlugin />
          <TwitterPlugin />
          <YouTubePlugin />
          <FigmaPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
};
