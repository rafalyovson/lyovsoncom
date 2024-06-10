/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Button } from "@/components/ui/button";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  List,
  ListOrdered,
  Quote,
  Text,
} from "lucide-react";
import { useState } from "react";
import { useDialog } from "../../hooks/use-dialog";
import { EmbedConfigs } from "../auto-embed-plugin";
import { InsertImageDialog } from "../images-plugin";

const blockOptions = [
  {
    value: "paragraph",
    label: "Paragraph",
    icon: Text,
    format: (editor: any) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    },
  },
  {
    value: "h1",
    label: "Large Heading",
    icon: Heading1,
    format: (editor: any) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    },
  },
  {
    value: "h2",
    label: "Medium Heading",
    icon: Heading2,
    format: (editor: any) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    },
  },
  {
    value: "h3",
    label: "Small Heading",
    icon: Heading3,
    format: (editor: any) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h3"));
        }
      });
    },
  },
  {
    value: "ul",
    label: "Bullet List",
    icon: List,
    format: (editor: any) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    },
    remove: (editor: any) => {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    },
  },
  {
    value: "ol",
    label: "Numbered List",
    icon: ListOrdered,
    format: (editor: any) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    },
    remove: (editor: any) => {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    },
  },
  {
    value: "quote",
    label: "Quote",
    icon: Quote,
    format: (editor: any) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    },
  },
  {
    value: "code",
    label: "Code Block",
    icon: Code,
    format: (editor: any) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    },
  },
];

export function BlockMenu({
  editor,
  blockType,
}: {
  editor: any;
  blockType: string;
}) {
  const [dialog, showDialog] = useDialog();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    const option = blockOptions.find((option) => option.value === value);
    if (option) {
      if (blockType === value && option.remove) {
        option.remove(editor);
      } else {
        option.format(editor);
      }
    }
  };

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger className="p-0">
          {blockOptions.map((option) =>
            option.value === blockType ? (
              <Button key={option.value} size={"icon"} variant={"ghost"}>
                <option.icon className=" h-4 w-4" />
              </Button>
            ) : null
          )}
        </MenubarTrigger>
        <MenubarContent>
          {blockOptions.map((option) => (
            <MenubarItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
            >
              <option.icon className="mr-2 h-4 w-4" />
              <span>{option.label}</span>
            </MenubarItem>
          ))}
          {EmbedConfigs.map((embedConfig) => (
            <MenubarItem
              key={embedConfig.type}
              onClick={() => {
                editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
              }}
            >
              <span>
                <Image className="mr-2 h-4 w-4" />
              </span>
              <span>{embedConfig.contentName}</span>
            </MenubarItem>
          ))}

          <MenubarItem
            onClick={() => {
              setIsOpen(true);
              showDialog({
                isOpen: true,
                setIsOpen: setIsOpen,
                title: "Insert Image",
                desc: "Add an image to your post.",
                getContent: () => (
                  <InsertImageDialog
                    activeEditor={editor}
                    onClose={() => setIsOpen(false)}
                  />
                ),
                isModal: true,
              });
            }}
            className="item"
          >
            <Image className="mr-2 h-4 w-4" />
            <span className="text">Image</span>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {isOpen && dialog}
    </>
  );
}
