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
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { EditorState } from "lexical";
import { useCallback, useState } from "react";
import { AutoEmbedPlugin } from "./plugins/auto-embed-plugin";
import { AutoLinkPlugin } from "./plugins/auto-link-plugin";
import { CodeHighlightPlugin } from "./plugins/code-highlight-plugin";
import { ComponentPickerPlugin } from "./plugins/component-picker-plugin";
import { FloatingTextFormatToolbarPlugin } from "./plugins/floating-text-format-tool-plugin";
import { ImageNode, ImagesPlugin } from "./plugins/images-plugin";
import { ListMaxIndentLevelPlugin } from "./plugins/list-max-indent-level-plugin";

import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import { XNode, XPlugin } from "./plugins/x-plugin";
import { YouTubeNode, YouTubePlugin } from "./plugins/youtube-plugin";
import { defaultTheme } from "./themes/default-theme";
import { debounce } from "./utils/debounce";

export const Editor = ({ state, setState }: { state: any; setState: any }) => {
  const editorConfig = {
    namespace: "Content",
    initialContentState: state,
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
      XNode,
      ImageNode,
    ],
  };

  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const debouncedOnChange = useCallback(
    debounce((editorState: EditorState) => {
      setState(editorState.toJSON());
    }, 1000),
    []
  );

  const onChange = (editorState: EditorState) => {
    debouncedOnChange(editorState);
  };

  const onRef = (floatingAnchorElem: HTMLDivElement) => {
    if (floatingAnchorElem !== null) {
      setFloatingAnchorElem(floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <main className=" border w-full max-w-[600px] mx-auto rounded-md">
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        {floatingAnchorElem && (
          <>
            <FloatingTextFormatToolbarPlugin
              isLinkEditMode={isLinkEditMode}
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}

        <section className=" rounded-b-md">
          <RichTextPlugin
            contentEditable={
              <article className="outline-none " ref={onRef}>
                <ContentEditable className="p-4 border outline-ring prose dark:prose-invert h-96 overflow-y-scroll" />
              </article>
            }
            placeholder={<></>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </section>

        <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
        <HistoryPlugin />
        <ImagesPlugin />
        <AutoFocusPlugin />
        <CodeHighlightPlugin />
        <ListPlugin />
        <ComponentPickerPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <AutoEmbedPlugin />
        <XPlugin />
        <YouTubePlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </main>
    </LexicalComposer>
  );
};
