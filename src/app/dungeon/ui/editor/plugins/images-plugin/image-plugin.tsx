// image-plugin.tsx
'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import React, { useEffect } from 'react';
import { $createImageNode, ImageNode } from './image-node';
import { ImageUploadDialog } from './image-upload-dialog';

export type InsertImagePayload = {
  src: string;
  altText: string;
  caption: string;
  group: string;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export const ImagesPlugin = (): React.ReactNode | null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const { src, altText, caption, group } = payload;
          const imageNode = $createImageNode({ src, altText, caption, group });
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

// Wrapper component to render the upload dialog and handle insertion
export function InsertImageDialog(props: {
  activeEditor: any;
  onClose: () => void;
}): React.ReactNode {
  const onUploadSuccess = (payload: InsertImagePayload) => {
    props.activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    props.onClose();
  };

  return <ImageUploadDialog onUploadSuccess={onUploadSuccess} />;
}
