"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { $isCodeNode, getCodeLanguages } from "@lexical/code";
import { $getNodeByKey } from "lexical";

export function CodeMenu({
  editor,
  selectedElementKey,
}: {
  editor: any;
  selectedElementKey: any;
}) {
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
      <MenubarTrigger>Choose</MenubarTrigger>

      <MenubarContent>
        {codeLanguages.map((language) => (
          <MenubarItem key={language} onClick={(e) => onCodeLanguageSelect(e)}>
            <span>{language}</span>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
}
