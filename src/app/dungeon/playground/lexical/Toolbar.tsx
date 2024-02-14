"use client";

import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBold,
  faItalic,
  faRotateLeft,
  faRotateRight,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsUnderline(selection.hasFormat("underline"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [updateToolbar, editor]);

  return (
    <div className="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 min-w-52 h-10 px-2 py-2 bg-[#1b2733] mb-4 space-x-2 flex items-center">
      <button
        title="Bold"
        type="button"
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          isBold ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <FontAwesomeIcon icon={faBold} className="text-white w-3.5 h-3.5" />
      </button>
      <button
        title="Italic"
        type="button"
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          isItalic ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <FontAwesomeIcon icon={faItalic} className="text-white w-3.5 h-3.5" />
      </button>
      <button
        title="Underline"
        type="button"
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          isUnderline ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        <FontAwesomeIcon
          icon={faUnderline}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <button
        title="Strikethrough"
        type="button"
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          isStrikethrough ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      >
        <FontAwesomeIcon
          icon={faStrikethrough}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <span className="w-[1px] bg-gray-600 block h-full"></span>
      <button
        title="Align left"
        type="button"
        className={clsx(
          "px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignLeft}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <button
        title="Align center"
        type="button"
        className={clsx(
          "px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignCenter}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <button
        title="Align right"
        type="button"
        className={clsx(
          "px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignRight}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <button
        title="Align justify"
        type="button"
        className={clsx(
          "px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
      >
        <FontAwesomeIcon
          icon={faAlignJustify}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <span className="w-[1px] bg-gray-600 block h-full"></span>
      <button
        title="Undo"
        type="button"
        className={clsx(
          "px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <FontAwesomeIcon
          icon={faRotateLeft}
          className="text-white w-3.5 h-3.5"
        />
      </button>
      <button
        title="Redo"
        type="button"
        className={clsx(
          "px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in"
        )}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <FontAwesomeIcon
          icon={faRotateRight}
          className="text-white w-3.5 h-3.5"
        />
      </button>
    </div>
  );
};
