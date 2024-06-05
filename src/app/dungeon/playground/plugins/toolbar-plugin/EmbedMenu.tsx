"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useModal } from "../../hooks/use-modal";
import { EmbedConfigs } from "../auto-embed-plugin";
import { InsertImageDialog } from "../images-plugin";

export function EmbedMenu({ editor }: { editor: any }) {
  const [modal, showModal] = useModal();
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
        <MenubarItem
          onClick={() => {
            showModal("Insert Image", (onClose) => (
              <InsertImageDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
          className="item"
        >
          <i className="icon image" />
          <span className="text">Image</span>
        </MenubarItem>
      </MenubarContent>
      {modal}
    </MenubarMenu>
  );
}
