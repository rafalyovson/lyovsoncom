"use client";

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
  List,
  ListOrdered,
  Quote,
  Text,
} from "lucide-react";

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
    label: "Small Heading",
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
        <MenubarTrigger>
          {blockOptions.map((option) =>
            option.value === blockType ? (
              <section className="flex gap-1 items-center" key={option.value}>
                <option.icon className="mr-2 h-4 w-4" />
                <span>{option.label}</span>
              </section>
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
        </MenubarContent>
      </MenubarMenu>
    </>
  );
}
