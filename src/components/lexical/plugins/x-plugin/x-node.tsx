/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementFormatType,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';

import { Card, CardContent } from '@/components/shadcn/ui/card';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import { XEmbed } from 'react-social-media-embed';
import { ReactElement } from 'react';

function $convertTweetElement(
  domNode: HTMLDivElement,
): DOMConversionOutput | null {
  const id = domNode.getAttribute('data-lexical-tweet-id');
  const url = domNode.getAttribute('data-lexical-tweet-url');
  if (id && url) {
    const node = $createTweetNode(id, url);
    return { node };
  }
  return null;
}

export type SerializedTweetNode = Spread<
  {
    id: string;
    url: string;
  },
  SerializedDecoratorBlockNode
>;

export class TweetNode extends DecoratorBlockNode {
  __id: string;
  url: string;
  static getType(): string {
    return 'tweet';
  }

  static clone(node: TweetNode): TweetNode {
    return new TweetNode(node.__id, node.url, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedTweetNode): TweetNode {
    const node = $createTweetNode(serializedNode.id, serializedNode.url);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedTweetNode {
    return {
      ...super.exportJSON(),
      id: this.getId(),
      url: this.url,
      type: 'tweet',
      version: 1,
    };
  }

  static importDOM(): DOMConversionMap<HTMLDivElement> | null {
    return {
      div: (domNode: HTMLDivElement) => {
        if (
          !domNode.hasAttribute('data-lexical-tweet-id') ||
          !domNode.hasAttribute('data-lexical-tweet-url')
        ) {
          return null;
        }
        return {
          conversion: $convertTweetElement,
          priority: 2,
        };
      },
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-tweet-id', this.__id);
    element.setAttribute('data-lexical-tweet-url', this.url);
    const text = document.createTextNode(this.getTextContent());
    element.append(text);
    return { element };
  }

  constructor(
    id: string,
    url: string,
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    this.__id = id;
    this.url = url;
  }

  getId(): string {
    return this.__id;
  }

  getUrl(): string {
    return this.url;
  }

  getTextContent(): string {
    return `https://x.com/i/web/status/${this.__id}`;
  }

  decorate(): ReactElement {
    if (!this.url) {
      return <></>;
    }
    return (
      <Card>
        <CardContent className="pt-6">
          <XEmbed url={this.url} />
        </CardContent>
      </Card>
    );
  }
}

export function $createTweetNode(tweetID: string, tweetURL: string): TweetNode {
  return new TweetNode(tweetID, tweetURL);
}

export function $isTweetNode(
  node: TweetNode | LexicalNode | null | undefined,
): node is TweetNode {
  return node instanceof TweetNode;
}
