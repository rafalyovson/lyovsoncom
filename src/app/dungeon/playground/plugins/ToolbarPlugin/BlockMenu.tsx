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

const blockOptions = [
  {
    value: "paragraph",
    label: "Normal",
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
          {blockType
            ? blockOptions.find((option) => option.value === blockType)?.label
            : "Select block type..."}
        </MenubarTrigger>
        <MenubarContent>
          {blockOptions.map((option) => (
            <MenubarItem
              key={option.value}
              onClick={() => handleSelect(option.value)}
            >
              <span className={`icon ${option.value}`} />
              <span>{option.label}</span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </>
  );
}
