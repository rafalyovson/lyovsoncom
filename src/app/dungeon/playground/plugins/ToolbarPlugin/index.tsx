"use client";

import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarMenu,
  MenubarSeparator,
} from "@/components/ui/menubar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from "@lexical/code";
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
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
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
import { useCallback, useEffect, useState } from "react";
import { getSelectedNode } from "../../utils/getSelectedNode";
import { BlockMenu } from "./BlockMenu";
import { EmbedMenu } from "./EmbedMenu";
import { FloatingLinkEditor } from "./FloatingLinkEditor";

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState("");
  const [showCodeMenu, setShowCodeMenu] = useState(false);
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
        setIsLink(true);
      } else {
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

  const codeLanguages = getCodeLanguages();
  const onCodeLanguageSelect = (e: any) => {
    editor.update(() => {
      if (selectedElementKey !== null) {
        const node = $getNodeByKey(selectedElementKey);
        if ($isCodeNode(node)) {
          node.setLanguage(e);
        }
      }
    });
  };

  const insertLink = () => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "");
    }
  };

  return (
    <Menubar>
      <MenubarMenu>
        <Button
          variant={canUndo ? "secondary" : "ghost"}
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          aria-label="Undo"
        >
          <Undo />
        </Button>
        <Button
          variant={canRedo ? "secondary" : "ghost"}
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          aria-label="Redo"
        >
          <Redo />
        </Button>
        <MenubarSeparator />
        <BlockMenu editor={editor} blockType={blockType} />
        <MenubarSeparator />
        {blockType === "code" ? (
          <>
            <div>
              {!showCodeMenu ? (
                <button
                  onClick={() => setShowCodeMenu(!showCodeMenu)}
                  aria-label="Embed Menu"
                >
                  <span className="text"> {codeLanguage}</span>
                </button>
              ) : (
                <Select
                  onValueChange={onCodeLanguageSelect}
                  defaultValue={codeLanguage}
                >
                  <SelectTrigger className="w-[120px] text-white">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {codeLanguages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <MenubarSeparator />
          </>
        ) : (
          <>
            <Button
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
              variant={isUnderline ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              }}
              aria-label="Format Underline"
            >
              <Underline />
            </Button>
            <Button
              variant={isStrikethrough ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
              }}
              aria-label="Format Strikethrough"
            >
              <Strikethrough />
            </Button>
            <Button
              variant={isCode ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
              }}
              aria-label="Insert Code"
            >
              <Code />
            </Button>
            <Button
              variant={isSubscript ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
              }}
              aria-label="Format Subscript"
            >
              <Subscript />
            </Button>
            <Button
              variant={isSuperscript ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
              }}
              aria-label="Format Superscript"
            >
              <Superscript />
            </Button>
            <Button
              variant={isLink ? "secondary" : "ghost"}
              onClick={insertLink}
              aria-label="Insert Link"
            >
              <Link />
            </Button>
            {isLink && <FloatingLinkEditor editor={editor} />}
            <MenubarSeparator />
            <Button
              variant={elementFormat === "left" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              aria-label="Left Align"
            >
              <AlignLeft />
            </Button>
            <Button
              variant={elementFormat === "center" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
              }}
              aria-label="Center Align"
            >
              <AlignCenter />
            </Button>
            <Button
              variant={elementFormat === "right" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              aria-label="Right Align"
            >
              <AlignRight />
            </Button>
            <Button
              variant={elementFormat === "justify" ? "secondary" : "ghost"}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
              }}
              aria-label="Justify Align"
            >
              <AlignJustify />
            </Button>
            <MenubarSeparator />
            <EmbedMenu editor={editor} />
          </>
        )}
      </MenubarMenu>
    </Menubar>
  );
}
