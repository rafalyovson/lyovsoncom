import { Card, CardContent } from "@/components/ui/card";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { Suspense } from "react";

export interface ImagePayload {
  altText: string;
  key?: NodeKey;
  src: string;
}

const isGoogleDocCheckboxImg = (img: HTMLImageElement): boolean => {
  return (
    img.parentElement != null &&
    img.parentElement.tagName === "LI" &&
    img.previousSibling === null &&
    img.getAttribute("aria-roledescription") === "checkbox"
  );
};

const $convertImageElement = (domNode: Node): null | DOMConversionOutput => {
  const img = domNode as HTMLImageElement;
  if (img.src.startsWith("file:///") || isGoogleDocCheckboxImg(img)) {
    return null;
  }
  const { alt: altText, src } = img;
  const node = $createImageNode({ altText, src });
  return { node };
};

export type SerializedImageNode = Spread<
  {
    altText: string;
    src: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, src } = serializedNode;
    const node = $createImageNode({
      altText,
      src,
    });

    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);

    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (_node: Node) => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(src: string, altText: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      src: this.getSrc(),
      type: "image",
      version: 1,
    };
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
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

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <Card>
          <CardContent className="pt-6">
            <img src={this.__src} alt={this.__altText} />
          </CardContent>
        </Card>
      </Suspense>
    );
  }
}

export const $createImageNode = ({
  altText,
  src,
  key,
}: ImagePayload): ImageNode => {
  return $applyNodeReplacement(new ImageNode(src, altText, key));
};

export const $isImageNode = (
  node: LexicalNode | null | undefined
): node is ImageNode => {
  return node instanceof ImageNode;
};
