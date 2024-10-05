import { Card, CardContent, CardFooter } from '@/components/shadcn/ui/card';
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import React, { ReactElement, Suspense } from 'react';

export interface ImagePayload {
  altText: string;
  key?: NodeKey;
  src: string;
  caption: string;
  group: string; // Add group to payload
}

const $convertImageElement = (domNode: Node): null | DOMConversionOutput => {
  const img = domNode as HTMLImageElement;
  if (img.src.startsWith('file:///')) {
    return null;
  }
  const { alt: altText, src } = img;
  const node = $createImageNode({ altText, src, caption: '', group: '' });
  return { node };
};

export type SerializedImageNode = Spread<
  {
    altText: string;
    src: string;
    caption: string;
    group: string; // Add group to serialized node
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactElement> {
  __src: string;
  __altText: string;
  __caption: string;
  __group: string; // Add group property

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__caption,
      node.__group, // Pass group when cloning
      node.__key, // Ensure key is passed correctly
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, src, caption, group } = serializedNode;
    return $createImageNode({
      altText,
      src,
      caption,
      group, // Include group
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText);

    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    caption: string,
    group: string,
    key?: NodeKey,
  ) {
    super(key); // Pass the key to the superclass
    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__group = group;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      src: this.getSrc(),
      caption: this.getCaption(),
      type: 'image',
      version: 1,
      group: this.getGroup(), // Include group in export
    };
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  getCaption(): string {
    return this.__caption;
  }

  getGroup(): string {
    return this.__group; // Getter for group
  }

  decorate(): ReactElement {
    return (
      <Suspense fallback={null}>
        <Card>
          <CardContent className="">
            <img src={this.__src} alt={this.__altText} />
          </CardContent>

          <CardFooter className="flex flex-row items-center  text-xs text-muted-foreground">
            {this.__caption}
          </CardFooter>
        </Card>
      </Suspense>
    );
  }
}

export const $createImageNode = ({
  altText,
  src,
  caption,
  group,
  key,
}: ImagePayload): ImageNode => {
  return $applyNodeReplacement(
    new ImageNode(src, altText, caption, group, key),
  );
};

export const $isImageNode = (
  node: LexicalNode | null | undefined,
): node is ImageNode => {
  return node instanceof ImageNode;
};
