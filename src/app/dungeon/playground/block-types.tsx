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
  Heading3,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

export const BlockTypes = [
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
