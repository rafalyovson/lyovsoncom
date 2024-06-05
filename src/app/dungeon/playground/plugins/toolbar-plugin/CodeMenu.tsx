"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { $isCodeNode } from "@lexical/code";
import { $getNodeByKey } from "lexical";
import { Code } from "lucide-react";

export function CodeMenu({
  editor,
  selectedElementKey,
  codeLanguage,
}: {
  editor: any;
  selectedElementKey: any;
  codeLanguage: string;
}) {
  // const codeLanguages = getCodeLanguages();
  const usefulCodeLanguages = [
    "javascript",
    "typescript",
    "python",
    "json",
    "html",
    "css",
    "markdown",
    "bash",
    "c",
    "rust",
  ].sort();

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

  return (
    <MenubarMenu>
      <MenubarTrigger className="font-mono">
        <Code className="mr-2 h-4 w-4" />
        <span>{codeLanguage.toUpperCase()}</span>
      </MenubarTrigger>
      <MenubarContent>
        {usefulCodeLanguages.map((language) => (
          <MenubarItem
            className="font-mono"
            key={language}
            onClick={() => onCodeLanguageSelect(language)}
          >
            <Code className="mr-2 h-4 w-4" />
            <span>{language.toUpperCase()}</span>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
}
