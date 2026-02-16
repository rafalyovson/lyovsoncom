import type {
  DefaultNodeTypes,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import React, { type JSX } from "react";
import { BannerBlock } from "@/blocks/Banner/Component";
import { CodeBlock, type CodeBlockProps } from "@/blocks/Code/Component";
import { GIFBlock } from "@/blocks/GIF/Component";
import type { GIFBlock as GIFBlockProps } from "@/blocks/GIF/types";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { QuoteBlock } from "@/blocks/Quote/Component";
import { XPostBlock } from "@/blocks/XPost/Component";
import { YouTubeBlock } from "@/blocks/YouTube/Component";
import { CMSLink } from "@/components/Link";
import type {
  BannerBlock as BannerBlockProps,
  MediaBlock as MediaBlockProps,
  QuoteBlock as QuoteBlockProps,
  XPostBlock as XPostBlockProps,
  YouTubeBlock as YouTubeBlockProps,
} from "@/payload-types";
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from "./nodeFormat";

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | MediaBlockProps
      | BannerBlockProps
      | CodeBlockProps
      | YouTubeBlockProps
      | XPostBlockProps
      | QuoteBlockProps
      | GIFBlockProps
    >;

type Props = {
  nodes: Array<NodeTypes | null | undefined>;
};

type RichTextBlock =
  | MediaBlockProps
  | BannerBlockProps
  | CodeBlockProps
  | YouTubeBlockProps
  | XPostBlockProps
  | QuoteBlockProps
  | GIFBlockProps;

function hasChildren(
  node: NodeTypes
): node is NodeTypes & { children: NodeTypes[] } {
  return "children" in node && Array.isArray(node.children);
}

function isRichTextBlock(block: unknown): block is RichTextBlock {
  if (!(block && typeof block === "object" && "blockType" in block)) {
    return false;
  }

  const blockType = block.blockType;

  return (
    blockType === "mediaBlock" ||
    blockType === "banner" ||
    blockType === "code" ||
    blockType === "youtube" ||
    blockType === "xpost" ||
    blockType === "quote" ||
    blockType === "gif"
  );
}

function serializeTextNode(
  node: Extract<NodeTypes, { type: "text" }>
): JSX.Element {
  const format = node.format ?? 0;
  let text: JSX.Element = <>{node.text}</>;

  if (format & IS_BOLD) {
    text = <strong>{text}</strong>;
  }
  if (format & IS_ITALIC) {
    text = <em>{text}</em>;
  }
  if (format & IS_STRIKETHROUGH) {
    text = <span className="line-through">{text}</span>;
  }
  if (format & IS_UNDERLINE) {
    text = <span className="underline">{text}</span>;
  }
  if (format & IS_CODE) {
    text = <code className="glass-longform-inline-code">{node.text}</code>;
  }
  if (format & IS_SUBSCRIPT) {
    text = <sub>{text}</sub>;
  }
  if (format & IS_SUPERSCRIPT) {
    text = <sup>{text}</sup>;
  }

  return text;
}

function normalizeChildren(node: NodeTypes): NodeTypes[] | null {
  if (!hasChildren(node)) {
    return null;
  }

  const children = node.children as NodeTypes[];

  if (node.type !== "list" || node.listType !== "check") {
    return children;
  }

  return children.map((child) => {
    if (child.type === "listitem" && child.checked == null) {
      return { ...child, checked: false };
    }

    return child;
  });
}

function serializeChildren(node: NodeTypes): Promise<JSX.Element | null> {
  const children = normalizeChildren(node);
  if (children == null) {
    return Promise.resolve(null);
  }

  return serializeLexical({ nodes: children });
}

function renderRichTextBlock(
  block: RichTextBlock,
  index: number
): JSX.Element | null {
  switch (block.blockType) {
    case "mediaBlock":
      return (
        <div className="glass-longform-block glass-stagger-1" key={index}>
          <MediaBlock
            className="glass-section"
            imgClassName="m-0 w-full rounded-lg"
            {...block}
            captionClassName="mx-auto max-w-[48rem] glass-text-secondary text-center"
            disableInnerContainer={true}
            enableGutter={false}
          />
        </div>
      );
    case "banner":
      return (
        <div className="glass-longform-block glass-stagger-2" key={index}>
          <BannerBlock className="glass-section glass-interactive" {...block} />
        </div>
      );
    case "code":
      return (
        <div className="glass-longform-block glass-stagger-2" key={index}>
          <CodeBlock className="glass-section font-mono" {...block} />
        </div>
      );
    case "youtube":
      return (
        <div
          className="glass-longform-block glass-section glass-stagger-1 overflow-hidden rounded-lg"
          key={index}
        >
          <YouTubeBlock {...block} />
        </div>
      );
    case "xpost":
      return (
        <div
          className="glass-longform-block glass-section glass-interactive glass-stagger-2"
          key={index}
        >
          <XPostBlock {...block} />
        </div>
      );
    case "quote":
      return (
        <div className="glass-longform-block glass-stagger-2" key={index}>
          <QuoteBlock className="glass-section glass-premium" {...block} />
        </div>
      );
    case "gif":
      return (
        <div
          className="glass-longform-block glass-section glass-stagger-1 overflow-hidden rounded-lg"
          key={index}
        >
          <GIFBlock {...block} />
        </div>
      );
    default:
      return null;
  }
}

function renderElementNode(
  node: Exclude<NodeTypes, { type: "block" } | { type: "text" }>,
  index: number,
  serializedChildren: JSX.Element | null
): JSX.Element | null {
  switch (node.type) {
    case "linebreak":
      return <br key={index} />;
    case "paragraph":
      return <p key={index}>{serializedChildren}</p>;
    case "heading": {
      const Tag = node.tag;
      return <Tag key={index}>{serializedChildren}</Tag>;
    }
    case "list": {
      const Tag = node.tag;
      return <Tag key={index}>{serializedChildren}</Tag>;
    }
    case "listitem":
      if (node.checked != null) {
        return (
          <li
            className={
              node.checked
                ? "glass-longform-checklist-item line-through opacity-65"
                : "glass-longform-checklist-item"
            }
            key={index}
            value={node.value}
          >
            <span className="mr-2 text-xs">{node.checked ? "[x]" : "[ ]"}</span>
            {serializedChildren}
          </li>
        );
      }

      return (
        <li key={index} value={node.value}>
          {serializedChildren}
        </li>
      );
    case "quote":
      return <blockquote key={index}>{serializedChildren}</blockquote>;
    case "link": {
      const isInternalLink = node.fields.linkType === "internal";

      return (
        <CMSLink
          className="transition-colors duration-300 hover:opacity-90"
          key={index}
          newTab={Boolean(node.fields.newTab)}
          reference={isInternalLink ? node.fields.doc : null}
          type={isInternalLink ? "reference" : "custom"}
          url={node.fields.url}
        >
          {serializedChildren}
        </CMSLink>
      );
    }
    default:
      return null;
  }
}

async function serializeNode(
  node: NodeTypes | null | undefined,
  index: number
): Promise<JSX.Element | null> {
  if (!node) {
    return null;
  }

  if (node.type === "text") {
    return (
      <React.Fragment key={index}>{serializeTextNode(node)}</React.Fragment>
    );
  }

  const serializedChildren = await serializeChildren(node);

  if (node.type === "block") {
    if (!isRichTextBlock(node.fields)) {
      return null;
    }

    return renderRichTextBlock(node.fields, index);
  }

  return renderElementNode(node, index, serializedChildren);
}

export async function serializeLexical({ nodes }: Props): Promise<JSX.Element> {
  const serializedNodes = await Promise.all(
    nodes?.map(async (node, index) => serializeNode(node, index)) ?? []
  );

  return <>{serializedNodes}</>;
}
