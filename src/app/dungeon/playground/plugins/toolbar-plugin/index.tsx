"use client";

import { Button } from "@/components/ui/button";
import { Menubar } from "@/components/ui/menubar";
import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isParentElementRTL } from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Link,
  Redo,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
} from "lucide-react";
import { Dispatch, useCallback, useEffect, useReducer } from "react";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { sanitizeUrl } from "../../utils/url";
import { BlockMenu } from "./BlockMenu";
import { CodeMenu } from "./CodeMenu";

const LowPriority = 1;
const NormalPriority = 2;

const initialState = {
  canUndo: false,
  canRedo: false,
  blockType: "paragraph",
  selectedElementKey: "",
  codeLanguage: "",
  isRTL: false,
  isLink: false,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  isSubscript: false,
  isSuperscript: false,
  elementFormat: "left",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_CAN_UNDO":
      return { ...state, canUndo: action.payload };
    case "SET_CAN_REDO":
      return { ...state, canRedo: action.payload };
    case "SET_BLOCK_TYPE":
      return { ...state, blockType: action.payload };
    case "SET_SELECTED_ELEMENT_KEY":
      return { ...state, selectedElementKey: action.payload };
    case "SET_CODE_LANGUAGE":
      return { ...state, codeLanguage: action.payload };
    case "SET_IS_RTL":
      return { ...state, isRTL: action.payload };
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
    case "SET_IS_CODE":
      return { ...state, isCode: action.payload };
    case "SET_IS_SUBSCRIPT":
      return { ...state, isSubscript: action.payload };
    case "SET_IS_SUPERSCRIPT":
      return { ...state, isSuperscript: action.payload };
    case "SET_ELEMENT_FORMAT":
      return { ...state, elementFormat: action.payload };
    default:
      return state;
  }
};

export const ToolbarPlugin = ({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        dispatch({ type: "SET_SELECTED_ELEMENT_KEY", payload: elementKey });
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          dispatch({ type: "SET_BLOCK_TYPE", payload: type });
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          dispatch({ type: "SET_BLOCK_TYPE", payload: type });
          if ($isCodeNode(element)) {
            dispatch({
              type: "SET_CODE_LANGUAGE",
              payload: element.getLanguage() || getDefaultCodeLanguage(),
            });
          }
        }
      }
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
      dispatch({ type: "SET_IS_CODE", payload: selection.hasFormat("code") });
      dispatch({
        type: "SET_IS_SUBSCRIPT",
        payload: selection.hasFormat("subscript"),
      });
      dispatch({
        type: "SET_IS_SUPERSCRIPT",
        payload: selection.hasFormat("superscript"),
      });

      dispatch({ type: "SET_IS_RTL", payload: $isParentElementRTL(selection) });

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        dispatch({ type: "SET_IS_LINK", payload: true });
      } else {
        dispatch({ type: "SET_IS_LINK", payload: false });
      }

      // Element Format
      let matchingParent;
      if ($isLinkNode(parent)) {
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      dispatch({
        type: "SET_ELEMENT_FORMAT",
        payload: $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left",
      });
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          dispatch({ type: "SET_CAN_UNDO", payload });
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          dispatch({ type: "SET_CAN_REDO", payload });
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!state.isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      NormalPriority
    );
  }, [editor, state.isLink, setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    if (!state.isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, state.isLink, setIsLinkEditMode]);

  return (
    <Menubar className="overflow-x-scroll flex gap-2 py-4 rounded-none  rounded-t-md h-14 overflow-y-hidden">
      <section className="flex gap-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={!state.canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={!state.canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </section>

      <BlockMenu editor={editor} blockType={state.blockType} />

      {state.blockType === "code" ? (
        <CodeMenu
          codeLanguage={state.codeLanguage}
          editor={editor}
          selectedElementKey={state.selectedElementKey}
        />
      ) : (
        <>
          <section className="flex gap-2">
            <Button
              size={"icon"}
              variant={state.isBold ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }}
              aria-label="Format Bold"
              data-highlighted={false}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={state.isItalic ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
              }}
              aria-label="Format Italics"
              data-highlighted={state.isBold}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={state.isUnderline ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              }}
              aria-label="Format Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={state.isStrikethrough ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
              }}
              aria-label="Format Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <Button
              size={"icon"}
              variant={state.isSubscript ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
              }}
              aria-label="Format Subscript"
            >
              <Subscript className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={state.isSuperscript ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
              }}
              aria-label="Format Superscript"
            >
              <Superscript className="h-4 w-4" />
            </Button>
          </section>
          <section className="flex gap-2">
            <Button
              size={"icon"}
              variant={state.isLink ? "secondary" : "ghost"}
              onClick={insertLink}
              aria-label="Insert Link"
            >
              <Link className="h-4 w-4" />
            </Button>

            <Button
              size={"icon"}
              variant={state.isCode ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
              }}
              aria-label="Insert Code"
            >
              <Code className="h-4 w-4" />
            </Button>
          </section>
          <section className="flex gap-2">
            <Button
              size={"icon"}
              variant={state.elementFormat === "left" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              aria-label="Left Align"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={state.elementFormat === "center" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
              }}
              aria-label="Center Align"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={state.elementFormat === "right" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              aria-label="Right Align"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              size={"icon"}
              variant={
                state.elementFormat === "justify" ? "secondary" : "ghost"
              }
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
              }}
              aria-label="Justify Align"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </section>
        </>
      )}
    </Menubar>
  );
};
