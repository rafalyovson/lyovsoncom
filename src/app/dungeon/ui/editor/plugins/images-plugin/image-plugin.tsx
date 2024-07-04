'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { $createImageNode, ImageNode, ImagePayload } from './image-node';

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageUriDialogBody(props: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <section className="flex flex-col gap-2">
      <section className="flex flex-col gap-2">
        <Label className="">{'Image URL'}</Label>
        <Input
          placeholder={'i.e. https://source.unsplash.com/random'}
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
          }}
          data-test-id={'image-modal-url-input'}
        />
      </section>

      <section className="flex flex-col gap-2">
        <Label className="">{'Alt Text'}</Label>
        <Input
          placeholder={'Random unsplash image'}
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value);
          }}
          data-test-id={'image-modal-alt-text-input'}
        />
      </section>

      <Button
        variant={'secondary'}
        data-test-id="image-modal-confirm-btn"
        disabled={isDisabled}
        onClick={() => props.onClick({ altText, src })}
      >
        Confirm
      </Button>
    </section>
  );
}

export function InsertImageUploadedDialogBody(props: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result);
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <section className="flex flex-col gap-2">
        <Label className="">{'Image Upload'}</Label>
        <Input
          type="file"
          accept={'image/*'}
          onChange={(e) => loadImage(e.target.files)}
          data-test-id={'image-modal-file-upload'}
          title="Upload an image"
        />
      </section>

      <section className="flex flex-col gap-2">
        <Label className="">{'Alt Text'}</Label>
        <Input
          placeholder={'Descriptive alternative text'}
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value);
          }}
          data-test-id={'image-modal-alt-text-input'}
        />
      </section>

      <Button
        variant={'secondary'}
        data-test-id="image-modal-file-upload-btn"
        disabled={isDisabled}
        onClick={() => props.onClick({ altText, src })}
      >
        Confirm
      </Button>
    </section>
  );
}

export function InsertImageDialog(props: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): ReactNode {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [props.activeEditor]);

  const onClick = (payload: InsertImagePayload) => {
    props.activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    props.onClose();
  };

  return (
    <>
      {!mode && (
        <section className="flex flex-col gap-2 ">
          <Button
            variant={'secondary'}
            data-test-id="image-modal-option-url"
            onClick={() => setMode('url')}
          >
            URL
          </Button>
          <Button
            variant={'secondary'}
            data-test-id="image-modal-option-file"
            onClick={() => setMode('file')}
          >
            File
          </Button>
        </section>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </>
  );
}

export const ImagesPlugin = (): ReactNode | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
};
