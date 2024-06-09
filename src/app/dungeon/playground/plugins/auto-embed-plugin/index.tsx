import type { LexicalEditor } from "lexical";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AutoEmbedOption,
  EmbedConfig,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Dispatch, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";
import { useDialog } from "../../hooks/use-dialog";
import { INSERT_TWEET_COMMAND } from "../x-plugin/x-plugin";
import { INSERT_YOUTUBE_COMMAND } from "../youtube-plugin/youtube-plugin";

interface EmbedConfigType extends EmbedConfig {
  // Human readable name of the embeded content e.g. Tweet or Google Map.
  contentName: string;

  // Icon for display.
  icon?: JSX.Element;

  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string;

  // For extra searching.
  keywords: Array<string>;

  // Embed a Figma Project.
  description?: string;
}

export const YoutubeEmbedConfig: EmbedConfigType = {
  contentName: "Youtube Video",

  exampleUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",

  // Icon for display.
  icon: <i className="icon youtube" />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },

  keywords: ["youtube", "video"],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url: string) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

    if (id != null) {
      return {
        id,
        url,
      };
    }

    return null;
  },

  type: "youtube-video",
};

export const TwitterEmbedConfig: EmbedConfigType = {
  // e.g. Tweet or Google Map.
  contentName: "Tweet",

  exampleUrl: "https://twitter.com/jack/status/20",

  // Icon for display.
  icon: <i className="icon tweet" />,

  // Create the Lexical embed node from the url data.
  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_TWEET_COMMAND, result.id);
  },

  // For extra searching.
  keywords: ["tweet", "twitter"],

  // Determine if a given URL is a match and return url data.
  parseUrl: (text: string) => {
    const match =
      /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(
        text
      );

    if (match != null) {
      return {
        id: match[5],
        url: match[1],
      };
    }

    return null;
  },

  type: "tweet",
};

export const EmbedConfigs = [TwitterEmbedConfig, YoutubeEmbedConfig];

const AutoEmbedMenuItem = ({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: AutoEmbedOption;
}) => {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <Button asChild variant={"ghost"}>
      <li
        key={option.key}
        tabIndex={-1}
        ref={option.setRefElement}
        role="option"
        aria-selected={isSelected}
        id={"typeahead-item-" + index}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
      >
        <span>{option.title}</span>
      </li>
    </Button>
  );
};

const AutoEmbedMenu = ({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter,
}: {
  selectedItemIndex: number | null;
  onOptionClick: (option: AutoEmbedOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<AutoEmbedOption>;
}) => {
  return (
    <ul className="flex flex-col gap-2 p-2 list-none border">
      {options.map((option: AutoEmbedOption, i: number) => (
        <AutoEmbedMenuItem
          index={i}
          isSelected={selectedItemIndex === i}
          onClick={() => onOptionClick(option, i)}
          onMouseEnter={() => onOptionMouseEnter(i)}
          key={option.key}
          option={option}
        />
      ))}
    </ul>
  );
};

const debounce = (callback: (text: string) => void, delay: number) => {
  let timeoutId: number;
  return (text: string) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(text);
    }, delay);
  };
};

export const AutoEmbedDialog = ({
  embedConfig,
  isOpen,
  setIsOpen,
}: {
  embedConfig: EmbedConfigType;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}): JSX.Element => {
  console.log(isOpen);

  const [text, setText] = useState("");
  const [editor] = useLexicalComposerContext();
  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null);

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
          Promise.resolve(embedConfig.parseUrl(inputText)).then(
            (parseResult) => {
              setEmbedResult(parseResult);
            }
          );
        } else if (embedResult != null) {
          setEmbedResult(null);
        }
      }, 200),
    [embedConfig, embedResult]
  );

  const onClick = () => {
    if (embedResult != null) {
      setIsOpen(false);
      embedConfig.insertNode(editor, embedResult);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Input
          type="text"
          placeholder={embedConfig.exampleUrl}
          value={text}
          data-test-id={`${embedConfig.type}-embed-modal-url`}
          onChange={(e) => {
            const { value } = e.target;
            setText(value);
            validateText(value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2 justify-end">
        <Button
          className="self-end"
          variant={"secondary"}
          disabled={!embedResult}
          onClick={onClick}
          data-test-id={`${embedConfig.type}-embed-modal-submit-btn`}
        >
          Embed
        </Button>
      </div>
    </div>
  );
};

export const AutoEmbedPlugin = (): JSX.Element => {
  const [dialog, showDialog] = useDialog();
  const [isOpen, setIsOpen] = useState(false);

  const openEmbedModal = (embedConfig: EmbedConfigType) => {
    setIsOpen(true);
    showDialog({
      title: `Embed ${embedConfig.contentName}`,
      desc: `Add a correct ${embedConfig.contentName} url.`,
      isOpen: true,
      setIsOpen: setIsOpen,
      isModal: true,
      getContent: () => (
        <AutoEmbedDialog
          embedConfig={embedConfig}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      ),
    });
  };

  const getMenuOptions = (
    activeEmbedConfig: EmbedConfigType,
    embedFn: () => void,
    dismissFn: () => void
  ) => {
    return [
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn,
      }),
      new AutoEmbedOption("Dismiss", {
        onSelect: dismissFn,
      }),
    ];
  };

  return (
    <>
      {isOpen && dialog}
      <LexicalAutoEmbedPlugin<EmbedConfigType>
        embedConfigs={EmbedConfigs}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={getMenuOptions}
        menuRenderFn={(
          anchorElementRef,
          {
            selectedIndex,
            options,
            selectOptionAndCleanUp,
            setHighlightedIndex,
          }
        ) =>
          anchorElementRef.current
            ? ReactDOM.createPortal(
                <AutoEmbedMenu
                  options={options}
                  selectedItemIndex={selectedIndex}
                  onOptionClick={(option: AutoEmbedOption, index: number) => {
                    setHighlightedIndex(index);
                    selectOptionAndCleanUp(option);
                  }}
                  onOptionMouseEnter={(index: number) => {
                    setHighlightedIndex(index);
                  }}
                />,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  );
};
