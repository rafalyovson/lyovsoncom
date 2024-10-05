import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER,
} from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Dispatch, ReactElement, useMemo, useState } from 'react';
import { EmbedConfigs, EmbedConfigType } from '@/data/misc/embed-configs';
import { useDialog } from '@/lib/hooks/use-dialog';
import { debounce } from '@/lib/utils';

export const AutoEmbedDialog = ({
  embedConfig,
  isOpen,
  setIsOpen,
}: {
  embedConfig: EmbedConfigType;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}): ReactElement => {
  console.log(isOpen);

  const [text, setText] = useState('');
  const [editor] = useLexicalComposerContext();
  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null);

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
          Promise.resolve(embedConfig.parseUrl(inputText)).then(
            (parseResult) => {
              setEmbedResult({ ...parseResult!, url: inputText });
            },
          );
        } else if (embedResult != null) {
          setEmbedResult(null);
        }
      }, 200),
    [embedConfig, embedResult],
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
          variant={'secondary'}
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

export const AutoEmbedPlugin = (): ReactElement => {
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

  return (
    <>
      {isOpen && dialog}
      <LexicalAutoEmbedPlugin<EmbedConfigType>
        embedConfigs={EmbedConfigs}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={() => []}
        menuRenderFn={() => null}
      />
    </>
  );
};
