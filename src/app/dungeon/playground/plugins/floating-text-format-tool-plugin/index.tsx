import { Button } from "@/components/ui/button";
import { $isCodeHighlightNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  Bold,
  Code,
  Italic,
  Link,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { Dispatch, useCallback, useEffect, useReducer, useRef } from "react";
import { createPortal } from "react-dom";
import { getDOMRangeRect } from "../../utils/getDOMRangeRect";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { setFloatingElemPosition } from "./set-floating-elem-position";

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
  | { type: "SET_IS_TEXT"; payload: boolean }
  | { type: "SET_IS_LINK"; payload: boolean }
  | { type: "SET_IS_BOLD"; payload: boolean }
  | { type: "SET_IS_ITALIC"; payload: boolean }
  | { type: "SET_IS_UNDERLINE"; payload: boolean }
  | { type: "SET_IS_STRIKETHROUGH"; payload: boolean }
  | { type: "SET_IS_SUBSCRIPT"; payload: boolean }
  | { type: "SET_IS_SUPERSCRIPT"; payload: boolean }
  | { type: "SET_IS_CODE"; payload: boolean };

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
  action: ToolbarAction
): ToolbarState => {
  switch (action.type) {
    case "SET_IS_TEXT":
      return { ...state, isText: action.payload };
    case "SET_IS_LINK":
      return { ...state, isLink: action.payload };
    case "SET_IS_BOLD":
      return { ...state, isBold: action.payload };
    case "SET_IS_ITALIC":
      return { ...state, isItalic: action.payload };
    case "SET_IS_UNDERLINE":
      return { ...state, isUnderline: action.payload };
    case "SET_IS_STRIKETHROUGH":
      return { ...state, isStrikethrough: action.payload };
    case "SET_IS_SUBSCRIPT":
      return { ...state, isSubscript: action.payload };
    case "SET_IS_SUPERSCRIPT":
      return { ...state, isSuperscript: action.payload };
    case "SET_IS_CODE":
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
};

const TextFormatFloatingToolbar = ({
  editor,
  anchorElem,
  state,
  dispatch,
  setIsLinkEditMode,
}: TextFormatFloatingToolbarProps): JSX.Element => {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!state.isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, state.isLink, setIsLinkEditMode]);

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          popupCharStylesEditorRef.current.style.pointerEvents = "none";
        }
      }
    }
  }

  function mouseUpListener() {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
        popupCharStylesEditorRef.current.style.pointerEvents = "auto";
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }
    return () => {};
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        state.isLink
      );
    }
  }, [editor, anchorElem, state.isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
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
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <aside
      className="flex justify-between gap-2 p-4 absolute top-0 left-0 z-10 opacity-0 border-radius-md border bg-background w-full max-w-96"
      ref={popupCharStylesEditorRef}
    >
      {editor.isEditable() && (
        <>
          <Button
            size="icon"
            variant={state.isBold ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            aria-label="Format text as bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isItalic ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            aria-label="Format text as italics"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isUnderline ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            aria-label="Format text to underlined"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isStrikethrough ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            aria-label="Format text with a strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isSubscript ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
            }}
            aria-label="Format Subscript"
          >
            <Subscript className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isSuperscript ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
            }}
            title="Superscript"
            aria-label="Format Superscript"
          >
            <Superscript className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isCode ? "secondary" : "ghost"}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={state.isLink ? "secondary" : "ghost"}
            onClick={insertLink}
          >
            <Link className="h-4 w-4" />
          </Button>
        </>
      )}
    </aside>
  );
};

const useFloatingTextFormatToolbar = (
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  setIsLinkEditMode: Dispatch<boolean>
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
        dispatch({ type: "SET_IS_TEXT", payload: false });
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      dispatch({ type: "SET_IS_BOLD", payload: selection.hasFormat("bold") });
      dispatch({
        type: "SET_IS_ITALIC",
        payload: selection.hasFormat("italic"),
      });
      dispatch({
        type: "SET_IS_UNDERLINE",
        payload: selection.hasFormat("underline"),
      });
      dispatch({
        type: "SET_IS_STRIKETHROUGH",
        payload: selection.hasFormat("strikethrough"),
      });
      dispatch({
        type: "SET_IS_SUBSCRIPT",
        payload: selection.hasFormat("subscript"),
      });
      dispatch({
        type: "SET_IS_SUPERSCRIPT",
        payload: selection.hasFormat("superscript"),
      });
      dispatch({ type: "SET_IS_CODE", payload: selection.hasFormat("code") });

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        dispatch({ type: "SET_IS_LINK", payload: true });
      } else {
        dispatch({ type: "SET_IS_LINK", payload: false });
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ""
      ) {
        dispatch({
          type: "SET_IS_TEXT",
          payload: $isTextNode(node) || $isParagraphNode(node),
        });
      } else {
        dispatch({ type: "SET_IS_TEXT", payload: false });
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (!selection.isCollapsed() && rawTextContent === "") {
        dispatch({ type: "SET_IS_TEXT", payload: false });
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          dispatch({ type: "SET_IS_TEXT", payload: false });
        }
      })
    );
  }, [editor, updatePopup]);

  if (!state.isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      state={state}
      dispatch={dispatch}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  );
};

export const FloatingTextFormatToolbarPlugin = ({
  anchorElem = document.body,
  setIsLinkEditMode,
}: {
  anchorElem?: HTMLElement;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem, setIsLinkEditMode);
};
