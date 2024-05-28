"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { EmbedConfigs } from "../AutoEmbedPlugin";

export function EmbedMenu({ editor }: { editor: any }) {
  return (
    <MenubarMenu>
      <MenubarTrigger>Embed</MenubarTrigger>
      <MenubarContent title="embeds">
        {EmbedConfigs.map((embedConfig) => (
          <MenubarItem
            key={embedConfig.type}
            onClick={() => {
              editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
            }}
          >
            <span>{embedConfig.icon}</span>
            <span>{embedConfig.contentName}</span>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
}
