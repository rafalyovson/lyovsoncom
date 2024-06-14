/* eslint-disable jsx-a11y/alt-text */
import { Button } from "@/components/ui/button";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { FORMAT_ELEMENT_COMMAND, LexicalEditor, TextNode } from "lexical";
import { AlignCenter, Image } from "lucide-react";
import React, { Dispatch, useCallback, useMemo, useState } from "react";
import * as ReactDOM from "react-dom";
import { BlockTypes } from "../../data/block-types";
import { EmbedConfigs } from "../../data/embed-configs";
import { useDialog } from "../../hooks/use-dialog";
import { InsertImageDialog } from "../images-plugin";

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

const ComponentPickerMenuItem = ({
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
  option: ComponentPickerOption;
}) => {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <Button
      className={`text-sm w-full flex gap-1 justify-start ${
        isSelected ? "bg-muted" : ""
      }`}
      variant={"ghost"}
      tabIndex={-1}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.icon}
      <span>{option.title}</span>
    </Button>
  );
};

type ShowDialog = ReturnType<typeof useDialog>[1];

function getBaseOptions(
  editor: LexicalEditor,
  showDialog: ShowDialog,
  setIsOpen: Dispatch<boolean>
) {
  return [
    ...BlockTypes.map(
      (type) =>
        new ComponentPickerOption(type.label, {
          icon: React.createElement(type.icon, { className: "w-4 h-4" }),
          keywords: [type.value],
          onSelect: () => type.format(editor),
        })
    ),

    ...EmbedConfigs.map(
      (embedConfig) =>
        new ComponentPickerOption(`${embedConfig.contentName}`, {
          icon: embedConfig.icon,
          keywords: [...embedConfig.keywords, "embed"],
          onSelect: () =>
            editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
        })
    ),

    new ComponentPickerOption("Image", {
      icon: <Image className="h-4 w-4" />,
      keywords: ["image", "photo", "picture", "file"],
      onSelect: () => {
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
      },
    }),
    ...(["left", "center", "right", "justify"] as const).map(
      (alignment) =>
        new ComponentPickerOption(`Align ${alignment}`, {
          icon: <AlignCenter className="h-4 w-4" />,
          keywords: ["align", "justify", alignment],
          onSelect: () =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        })
    ),
  ];
}

export const ComponentPickerPlugin = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();

  const [dialog, showDialog] = useDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor, showDialog, setIsOpen);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, "i");

    return [
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword))
      ),
    ];
  }, [editor, queryString, showDialog]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <>
      {isOpen && dialog}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="fixed">
                  <nav className="flex flex-col w-48 bg-background rounded-md h-72 overflow-y-scroll">
                    {options.map((option, i: number) => (
                      <ComponentPickerMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
                        option={option}
                      />
                    ))}
                  </nav>
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  );
};
