"use client";

import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useEffect, useRef } from "react";
import { EmbedConfigs } from "../AutoEmbedPlugin";

export function EmbedMenu({
  editor,

  toolbarRef,
  setShowEmbedMenu,
}: {
  editor: any;

  toolbarRef: any;
  setShowEmbedMenu: any;
}) {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left + 600}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;
    if (dropDown !== null && toolbar !== null) {
      const handle = (event: any) => {
        const target = event.target;
        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowEmbedMenu(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
    return () => {};
  }, [dropDownRef, setShowEmbedMenu, toolbarRef]);

  return (
    <div className="dropdown flex flex-col  gap-2" ref={dropDownRef}>
      <div title="embeds">
        {EmbedConfigs.map((embedConfig) => (
          <button
            className="item"
            key={embedConfig.type}
            onClick={() => {
              editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
            }}
          >
            <span>{embedConfig.icon}</span>
            <span className="text">{embedConfig.contentName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
