import { Card, CardContent } from "@/components/ui/card";
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";
import { YouTubeEmbed } from "react-social-media-embed";

export type SerializedYouTubeNode = Spread<
  {
    id: string;
    url: string;
  },
  SerializedDecoratorBlockNode
>;

function $convertYoutubeElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  const videoID = domNode.getAttribute("data-lexical-youtube");
  const videoURL = domNode.getAttribute("data-lexical-youtube-url");
  if (videoID && videoURL) {
    const node = $createYouTubeNode(videoID, videoURL);
    return { node };
  }
  return null;
}

export class YouTubeNode extends DecoratorBlockNode {
  __id: string;
  url: string;

  static getType(): string {
    return "youtube";
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.url, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    const node = $createYouTubeNode(serializedNode.id, serializedNode.url);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      ...super.exportJSON(),
      type: "youtube",
      version: 1,
      id: this.__id,
      url: this.url,
    };
  }

  constructor(
    id: string,
    url: string,
    format?: ElementFormatType,
    key?: NodeKey
  ) {
    super(format, key);
    this.__id = id;
    this.url = url;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("iframe");
    element.setAttribute("data-lexical-youtube", this.__id);
    element.setAttribute("width", "560");
    element.setAttribute("height", "315");
    element.setAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${this.__id}`
    );
    element.setAttribute("frameborder", "0");
    element.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    );
    element.setAttribute("allowfullscreen", "true");
    element.setAttribute("title", "YouTube video");
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute("data-lexical-youtube")) {
          return null;
        }
        return {
          conversion: $convertYoutubeElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return `https://www.youtube.com/watch?v=${this.__id}`;
  }

  decorate(_editor: LexicalEditor): JSX.Element {
    if (!this.url) {
      return <></>;
    }
    return (
      <Card>
        <CardContent className="pt-6">
          <YouTubeEmbed url={this.url} />
        </CardContent>
      </Card>
    );
  }
}

export function $createYouTubeNode(
  videoID: string,
  videoURL: string
): YouTubeNode {
  return new YouTubeNode(videoID, videoURL);
}

export function $isYouTubeNode(
  node: YouTubeNode | LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
