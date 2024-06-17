"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { capitalize } from "@/lib/utils";
import { $isCodeNode, getCodeLanguages } from "@lexical/code";
import { $getNodeByKey } from "lexical";

export function CodeMenu({
  editor,
  selectedElementKey,
  codeLanguage,
}: {
  editor: any;
  selectedElementKey: any;
  codeLanguage: string;
}) {
  console.log(window.Prism.languages);

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

  return (
    <MenubarMenu>
      <MenubarTrigger className="font-mono">
        <span>{capitalize(codeLanguage)}</span>
      </MenubarTrigger>
      <MenubarContent className="h-72 overflow-y-scroll">
        {codeLanguages.map((language: string) => (
          <MenubarItem
            className="font-mono"
            key={language}
            onClick={() => onCodeLanguageSelect(language)}
          >
            <span>{capitalize(language)}</span>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
}
