/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Button } from "@/components/ui/button";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { Image } from "lucide-react";
import { useState } from "react";
import { BlockTypes } from "../../data/block-types";
import { EmbedConfigs } from "../../data/embed-configs";
import { useDialog } from "../../hooks/use-dialog";
import { InsertImageDialog } from "../images-plugin";

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
    const option = BlockTypes.find((option) => option.value === value);
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
          {BlockTypes.map((option) =>
            option.value === blockType ? (
              <Button key={option.value} size={"icon"} variant={"ghost"}>
                <option.icon className="w-4 h-4" />
              </Button>
            ) : null
          )}
        </MenubarTrigger>
        <MenubarContent>
          {BlockTypes.map((option) => (
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
              <span>{embedConfig.icon}</span>
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
