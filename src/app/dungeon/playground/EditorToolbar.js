"use client";

import {
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

import React from "react";

const initialState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FORMAT":
      return {
        ...state,
        [action.format]: action.value,
      };
    default:
      throw new Error();
  }
}

const EditorToolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      dispatch({
        type: "UPDATE_FORMAT",
        format: "isBold",
        value: selection.hasFormat("bold"),
      });
      dispatch({
        type: "UPDATE_FORMAT",
        format: "isItalic",
        value: selection.hasFormat("italic"),
      });
      dispatch({
        type: "UPDATE_FORMAT",
        format: "isUnderline",
        value: selection.hasFormat("underline"),
      });
      dispatch({
        type: "UPDATE_FORMAT",
        format: "isStrikethrough",
        value: selection.hasFormat("strikethrough"),
      });
    }
  }, []);

  React.useEffect(() => {
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
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          state.isBold ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <FontAwesomeIcon icon={faBold} className="text-white w-3.5 h-3.5" />
      </button>
      <button
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          state.isItalic ? "bg-gray-700" : "bg-transparent"
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <FontAwesomeIcon icon={faItalic} className="text-white w-3.5 h-3.5" />
      </button>
      <button
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          state.isUnderline ? "bg-gray-700" : "bg-transparent"
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
        className={clsx(
          "px-1 hover:bg-gray-700 transition-colors duration-100 ease-in",
          state.isStrikethrough ? "bg-gray-700" : "bg-transparent"
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
    </div>
  );
};

export default EditorToolbar;
