'use client';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { EditorState } from 'lexical';
import { useCallback, useState } from 'react';
import { AutoEmbedPlugin } from './plugins/auto-embed-plugin';
import { AutoLinkPlugin } from './plugins/auto-link-plugin';
import { CodeHighlightPlugin } from './plugins/code-highlight-plugin';
import { ComponentPickerPlugin } from './plugins/component-picker-plugin';
import { FloatingTextFormatToolbarPlugin } from './plugins/floating-text-format-tool-plugin';
import { ImageNode, ImagesPlugin } from './plugins/images-plugin';
import { ListMaxIndentLevelPlugin } from './plugins/list-max-indent-level-plugin';
import { XNode, XPlugin } from './plugins/x-plugin';
import { YouTubeNode, YouTubePlugin } from './plugins/youtube-plugin';
import { defaultTheme } from './themes/default-theme';
import { debounce } from './utils/debounce';

type EditorProps = {
  state: any;
  setState: any;
  name?: string;
};

export const Editor = ({ state, setState, name }: EditorProps) => {
  const editorConfig = {
    namespace: 'Content',
    editorState: state ? JSON.stringify(state) : undefined,

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
    [],
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
      <main className="h-full border w-full  mx-auto rounded-md flex flex-col gap-2 justify-between ">
        {/*<ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />*/}
        {floatingAnchorElem && (
          <>
            <FloatingTextFormatToolbarPlugin
              isLinkEditMode={isLinkEditMode}
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}

        <section className="flex flex-col gap-2 rounded-lg h-full ">
          <RichTextPlugin
            contentEditable={
              <article
                className="outline-none md:h-[700px] flex-grow rounded-lg"
                ref={onRef}
              >
                <ContentEditable
                  name={name}
                  className="p-4 outline-ring prose dark:prose-invert scrollbar-slim rounded-lg  overflow-y-auto max-w-none min-h-60 h-full"
                />
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
