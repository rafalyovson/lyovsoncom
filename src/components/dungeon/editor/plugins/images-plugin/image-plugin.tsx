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
  LexicalEditor,
} from 'lexical';
import React, { ReactNode, useEffect, useState } from 'react';
import { $createImageNode, ImageNode } from './image-node';
import { ImageUploadForm } from '@/components/dungeon/image-uplaod-form';
import { Image } from '@/data/schema'; // Assuming this is where your image type is defined

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

// InsertImageDialog component updated to use ImageUploadForm
export function InsertImageDialog(props: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): ReactNode {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const handleImageInsert = (image: Image) => {
    if (image?.url) {
      props.activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: image.url,
        altText: image.altText || '',
        caption: image.caption || '',
        group: image.group || 'default-group', // Adjust group based on your needs
      } as InsertImagePayload);

      props.onClose(); // Close the dialog after inserting the image
    }
  };

  useEffect(() => {
    if (selectedImage) {
      handleImageInsert(selectedImage);
    }
  }, [selectedImage]);

  return (
    <>
      {isOpen && (
        <ImageUploadForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          image={selectedImage}
          setImage={setSelectedImage}
          group="editor-images" // Use an appropriate group for context
        />
      )}
    </>
  );
}
