import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { $isCodeHighlightNode } from '@lexical/code';
import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isLineBreakNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  Bold,
  CircleCheckBig,
  CircleOff,
  Code,
  Italic,
  Link,
  Pen,
  Strikethrough,
  Subscript,
  Superscript,
  Trash2,
  Underline,
} from 'lucide-react';
import * as React from 'react';
import {
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { getDOMRangeRect } from '../../utils/get-dom-rect-range';
import { getSelectedNode } from '../../utils/get-selected-node';
import { sanitizeUrl } from '../../utils/url';
import { setFloatingElemPosition } from './set-floating-elem-position';

// Define the state type
type ToolbarState = {
  isText: boolean;
  isLink: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isCode: boolean;
};

// Define the action type
type ToolbarAction =
  | { type: 'SET_IS_TEXT'; payload: boolean }
  | { type: 'SET_IS_LINK'; payload: boolean }
  | { type: 'SET_IS_BOLD'; payload: boolean }
  | { type: 'SET_IS_ITALIC'; payload: boolean }
  | { type: 'SET_IS_UNDERLINE'; payload: boolean }
  | { type: 'SET_IS_STRIKETHROUGH'; payload: boolean }
  | { type: 'SET_IS_SUBSCRIPT'; payload: boolean }
  | { type: 'SET_IS_SUPERSCRIPT'; payload: boolean }
  | { type: 'SET_IS_CODE'; payload: boolean };

// Initial state for the reducer
const initialState: ToolbarState = {
  isText: false,
  isLink: false,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isCode: false,
};

// Reducer function to manage the toolbar state
const toolbarReducer = (
  state: ToolbarState,
  action: ToolbarAction,
): ToolbarState => {
  switch (action.type) {
    case 'SET_IS_TEXT':
      return { ...state, isText: action.payload };
    case 'SET_IS_LINK':
      return { ...state, isLink: action.payload };
    case 'SET_IS_BOLD':
      return { ...state, isBold: action.payload };
    case 'SET_IS_ITALIC':
      return { ...state, isItalic: action.payload };
    case 'SET_IS_UNDERLINE':
      return { ...state, isUnderline: action.payload };
    case 'SET_IS_STRIKETHROUGH':
      return { ...state, isStrikethrough: action.payload };
    case 'SET_IS_SUBSCRIPT':
      return { ...state, isSubscript: action.payload };
    case 'SET_IS_SUPERSCRIPT':
      return { ...state, isSuperscript: action.payload };
    case 'SET_IS_CODE':
      return { ...state, isCode: action.payload };
    default:
      return state;
  }
};

// Define props for TextFormatFloatingToolbar component
type TextFormatFloatingToolbarProps = {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  state: ToolbarState;
  dispatch: Dispatch<ToolbarAction>;
  setIsLinkEditMode: Dispatch<boolean>;
  isLinkEditMode: boolean;
};

const TextFormatFloatingToolbar = ({
  editor,
  isLinkEditMode,
  anchorElem,
  state,
  dispatch,
  setIsLinkEditMode,
}: TextFormatFloatingToolbarProps): JSX.Element => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const [linkUrl, setLinkUrl] = useState('');
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://');
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(
    null,
  );

  const insertLink = useCallback(() => {
    if (!state.isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, state.isLink, setIsLinkEditMode]);

  function mouseMoveListener(e: MouseEvent) {
    if (editorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (editorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!editorRef.current.contains(elementUnderMouse)) {
          editorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }

  function mouseUpListener() {
    if (editorRef?.current) {
      if (editorRef.current.style.pointerEvents !== 'auto') {
        editorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (editorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
    return () => {};
  }, [editorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const linkParent = $findMatchingParent(node, $isLinkNode);

      if (linkParent) {
        setLinkUrl(linkParent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl);
      }
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      !nativeSelection.isCollapsed &&
      editor.isEditable()
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
      setFloatingElemPosition(rangeRect, editorElem, anchorElem);
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPosition(null, editorElem, anchorElem);
      }
      setLastSelection(null);
      setIsLinkEditMode(false);
      setLinkUrl('');
    }
  }, [editor, isLinkEditMode, linkUrl, anchorElem, setIsLinkEditMode]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (state.isLink) {
            dispatch({ type: 'SET_IS_LINK', payload: false });
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar, state.isLink, dispatch]);

  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLinkEditMode, state.isLink]);

  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent();
            if ($isAutoLinkNode(parent)) {
              const linkNode = $createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              });
              parent.replace(linkNode, true);
            }
          }
        });
      }
      setEditedLinkUrl('https://');
      setIsLinkEditMode(false);
    }
  };

  const monitorInputInteraction = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLinkSubmission();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsLinkEditMode(false);
    }
  };

  return (
    <aside
      className="flex flex-col absolute top-0 left-0 z-10 opacity-0 border-radius-md border bg-background w-full max-w-96"
      ref={editorRef}
    >
      {editor.isEditable() && (
        <section className="flex justify-between gap-2 p-2 border-b">
          <Button
            size="icon"
            variant={state.isBold ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
            aria-label="Format text as bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isItalic ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
            aria-label="Format text as italics"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isUnderline ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
            aria-label="Format text to underlined"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isStrikethrough ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
            aria-label="Format text with a strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isSubscript ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
            }}
            aria-label="Format Subscript"
          >
            <Subscript className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isSuperscript ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
            }}
            title="Superscript"
            aria-label="Format Superscript"
          >
            <Superscript className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isCode ? 'secondary' : 'ghost'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isLink ? 'secondary' : 'ghost'}
            onClick={insertLink}
          >
            <Link className="h-4 w-4" />
          </Button>
        </section>
      )}
      {!state.isLink ? null : isLinkEditMode ? (
        <section className="flex gap-4 justify-between flex-grow p-2">
          <Input
            className="link-input"
            title="Enter URL and press Enter"
            ref={inputRef}
            value={editedLinkUrl}
            onChange={(event) => {
              setEditedLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event);
            }}
          />

          <section className="flex gap-2 justify-between flex-grow">
            <Button
              size="icon"
              variant={'ghost'}
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setIsLinkEditMode(false);
              }}
            >
              <CircleOff className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant={'ghost'}
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                handleLinkSubmission();
                // setIsLinkEditMode(false);
              }}
            >
              <CircleCheckBig className="h-4 w-4" />
            </Button>
          </section>
        </section>
      ) : (
        <section className="flex gap-4 justify-between flex-grow p-2 border-b">
          <a
            className="underline cursor-pointer text-sm h-10 px-3 py-2"
            href={sanitizeUrl(linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkUrl}
          </a>
          <section className="flex gap-2">
            <Button
              size="icon"
              variant={'ghost'}
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={'ghost'}
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditedLinkUrl(linkUrl);
                setIsLinkEditMode(true);
              }}
            >
              <Pen className="h-4 w-4" />
            </Button>
          </section>
        </section>
      )}
    </aside>
  );
};

const useFloatingTextFormatToolbar = (
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>,
): JSX.Element | null => {
  const [state, dispatch] = useReducer(toolbarReducer, initialState);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        dispatch({ type: 'SET_IS_TEXT', payload: false });
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      // Link node

      const node = getSelectedNode(selection);
      const linkNode = $findMatchingParent(node, $isLinkNode);
      const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);

      if (!(linkNode || autoLinkNode)) {
        dispatch({ type: 'SET_IS_LINK', payload: false });
      }

      const badNode = selection
        .getNodes()
        .filter((node) => !$isLineBreakNode(node))
        .find((node) => {
          const linkNode = $findMatchingParent(node, $isLinkNode);
          const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode);
          return (
            (linkNode && !linkNode.is(linkNode)) ||
            (linkNode && !linkNode.is(linkNode)) ||
            (autoLinkNode && !autoLinkNode.is(autoLinkNode)) ||
            (autoLinkNode && !autoLinkNode.is(autoLinkNode))
          );
        });

      if (!badNode) {
        dispatch({ type: 'SET_IS_LINK', payload: true });
      } else {
        dispatch({ type: 'SET_IS_LINK', payload: false });
      }

      // Update text format
      dispatch({ type: 'SET_IS_BOLD', payload: selection.hasFormat('bold') });
      dispatch({
        type: 'SET_IS_ITALIC',
        payload: selection.hasFormat('italic'),
      });
      dispatch({
        type: 'SET_IS_UNDERLINE',
        payload: selection.hasFormat('underline'),
      });
      dispatch({
        type: 'SET_IS_STRIKETHROUGH',
        payload: selection.hasFormat('strikethrough'),
      });
      dispatch({
        type: 'SET_IS_SUBSCRIPT',
        payload: selection.hasFormat('subscript'),
      });
      dispatch({
        type: 'SET_IS_SUPERSCRIPT',
        payload: selection.hasFormat('superscript'),
      });
      dispatch({ type: 'SET_IS_CODE', payload: selection.hasFormat('code') });

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        dispatch({ type: 'SET_IS_LINK', payload: true });
      } else {
        dispatch({ type: 'SET_IS_LINK', payload: false });
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        dispatch({
          type: 'SET_IS_TEXT',
          payload: $isTextNode(node) || $isParagraphNode(node),
        });
      } else {
        dispatch({ type: 'SET_IS_TEXT', payload: false });
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        dispatch({ type: 'SET_IS_TEXT', payload: false });
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          dispatch({ type: 'SET_IS_TEXT', payload: false });
        }
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updatePopup();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updatePopup]);

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      state={state}
      dispatch={dispatch}
      setIsLinkEditMode={setIsLinkEditMode}
      isLinkEditMode={isLinkEditMode}
    />,
    anchorElem,
  );
};

export const FloatingTextFormatToolbarPlugin = ({
  anchorElem = document.body,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  anchorElem?: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode,
  );
};
