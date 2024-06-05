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
  ElementFormatType,
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
import { Dispatch, useCallback, useEffect, useState } from "react";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { sanitizeUrl } from "../../utils/url";
import { BlockMenu } from "./BlockMenu";
import { CodeMenu } from "./CodeMenu";
import { EmbedMenu } from "./EmbedMenu";

const LowPriority = 1;
const NormalPriority = 2;

export const ToolbarPlugin = ({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const [_, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");

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
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));

      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        // setIsLinkEditMode(true);
        setIsLink(true);
      } else {
        // setIsLinkEditMode(false);
        setIsLink(false);
      }

      // Element Format

      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left"
      );
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
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
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
          if (!isLink) {
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
  }, [editor, isLink, setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  return (
    <Menubar className="overflow-x-scroll flex gap-2 h-full py-4">
      <section className="flex gap-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          aria-label="Undo"
        >
          <Undo />
        </Button>
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          aria-label="Redo"
        >
          <Redo />
        </Button>
      </section>

      <BlockMenu editor={editor} blockType={blockType} />

      {blockType === "code" ? (
        <>
          <CodeMenu
            codeLanguage={codeLanguage}
            editor={editor}
            selectedElementKey={selectedElementKey}
          />
        </>
      ) : (
        <>
          <section className="flex gap-2">
            <Button
              size={"icon"}
              variant={isBold ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }}
              aria-label="Format Bold"
              data-highlighted={false}
            >
              <Bold />
            </Button>
            <Button
              size={"icon"}
              variant={isItalic ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
              }}
              aria-label="Format Italics"
              data-highlighted={isBold}
            >
              <Italic />
            </Button>
            <Button
              size={"icon"}
              variant={isUnderline ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              }}
              aria-label="Format Underline"
            >
              <Underline />
            </Button>
            <Button
              size={"icon"}
              variant={isStrikethrough ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
              }}
              aria-label="Format Strikethrough"
            >
              <Strikethrough />
            </Button>

            <Button
              size={"icon"}
              variant={isSubscript ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
              }}
              aria-label="Format Subscript"
            >
              <Subscript />
            </Button>
            <Button
              size={"icon"}
              variant={isSuperscript ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
              }}
              aria-label="Format Superscript"
            >
              <Superscript />
            </Button>
          </section>
          <section className="flex gap-2">
            <Button
              size={"icon"}
              variant={isLink ? "secondary" : "ghost"}
              onClick={insertLink}
              aria-label="Insert Link"
            >
              <Link />
            </Button>

            <Button
              size={"icon"}
              variant={isCode ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
              }}
              aria-label="Insert Code"
            >
              <Code />
            </Button>
          </section>
          <section className="flex gap-2">
            <Button
              size={"icon"}
              variant={elementFormat === "left" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              aria-label="Left Align"
            >
              <AlignLeft />
            </Button>
            <Button
              size={"icon"}
              variant={elementFormat === "center" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
              }}
              aria-label="Center Align"
            >
              <AlignCenter />
            </Button>
            <Button
              size={"icon"}
              variant={elementFormat === "right" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              aria-label="Right Align"
            >
              <AlignRight />
            </Button>
            <Button
              size={"icon"}
              variant={elementFormat === "justify" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
              }}
              aria-label="Justify Align"
            >
              <AlignJustify />
            </Button>
          </section>
          <EmbedMenu editor={editor} />
        </>
      )}
    </Menubar>
  );
};
