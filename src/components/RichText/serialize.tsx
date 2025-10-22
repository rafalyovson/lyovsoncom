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
  nodes: NodeTypes[];
};

export async function serializeLexical({ nodes }: Props): Promise<JSX.Element> {
  const serializedNodes = await Promise.all(
    nodes?.map(async (node, index): Promise<JSX.Element | null> => {
        if (node == null) {
          return null;
        }

        if (node.type === "text") {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>;
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>;
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>;
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span className="line-through" key={index}>
                {text}
              </span>
            );
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span className="underline" key={index}>
                {text}
              </span>
            );
          }
          if (node.format & IS_CODE) {
            text = (
              <code
                className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
                key={index}
              >
                {node.text}
              </code>
            );
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>;
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>;
          }

          return text;
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = async (node: NodeTypes): Promise<JSX.Element | null> => {
          if (!("children" in node) || node.children == null) {
            return null;
          }
          if (node?.type === "list" && node?.listType === "check") {
            for (const item of node.children) {
              if ("checked" in item && !item?.checked) {
                item.checked = false;
              }
            }
          }
          return await serializeLexical({ nodes: node.children as NodeTypes[] });
        };

        const serializedChildren =
          "children" in node ? await serializedChildrenFn(node) : "";

        if (node.type === "block") {
          const block = node.fields;

          const blockType = block?.blockType;

          if (!(block && blockType)) {
            return null;
          }

          switch (blockType) {
            case "mediaBlock":
              return (
                <div
                  className="glass-stagger-1 col-span-3 col-start-1"
                  key={index}
                >
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
                <div className="glass-stagger-2 col-start-2 mb-6" key={index}>
                  <BannerBlock
                    className="glass-section glass-interactive"
                    {...block}
                  />
                </div>
              );
            case "code":
              return (
                <div className="glass-stagger-2 col-start-2" key={index}>
                  <CodeBlock className="glass-section font-mono" {...block} />
                </div>
              );
            case "youtube":
              return (
                <div
                  className="glass-stagger-1 glass-section col-span-3 col-start-1 overflow-hidden rounded-lg"
                  key={index}
                >
                  <YouTubeBlock {...block} />
                </div>
              );
            case "xpost":
              return (
                <div
                  className="glass-stagger-2 glass-section glass-interactive col-start-2"
                  key={index}
                >
                  <XPostBlock {...block} />
                </div>
              );
            case "quote":
              return (
                <div className="glass-stagger-2 col-start-2" key={index}>
                  <QuoteBlock
                    className="glass-section glass-premium"
                    {...block}
                  />
                </div>
              );
            case "gif":
              return (
                <div
                  className="glass-stagger-1 glass-section col-span-3 col-start-1 overflow-hidden rounded-lg"
                  key={index}
                >
                  <GIFBlock {...block} />
                </div>
              );
            default:
              return null;
          }
        }
        switch (node.type) {
          case "linebreak": {
            return <br className="col-start-2" key={index} />;
          }
          case "paragraph": {
            return (
              <p className="col-start-2" key={index}>
                {serializedChildren}
              </p>
            );
          }
          case "heading": {
            const Tag = node?.tag;
            return (
              <Tag className="col-start-2" key={index}>
                {serializedChildren}
              </Tag>
            );
          }
          case "list": {
            const Tag = node?.tag;
            return (
              <Tag className="col-start-2" key={index}>
                {serializedChildren}
              </Tag>
            );
          }
          case "listitem": {
            if (node?.checked != null) {
              return (
                <li
                  className={`${node.checked ? "line-through opacity-60" : ""}`}
                  key={index}
                  tabIndex={-1}
                  value={node?.value}
                >
                  <span className="mr-2">{node.checked ? "✅" : "☐"}</span>
                  {serializedChildren}
                </li>
              );
            }
            return (
              <li key={index} value={node?.value}>
                {serializedChildren}
              </li>
            );
          }
          case "quote": {
            return (
              <blockquote className="col-start-2" key={index}>
                {serializedChildren}
              </blockquote>
            );
          }
          case "link": {
            const fields = node.fields;

            return (
              <CMSLink
                className="underline transition-colors duration-300 hover:no-underline"
                key={index}
                newTab={Boolean(fields?.newTab)}
                reference={fields.doc as any}
                type={fields.linkType === "internal" ? "reference" : "custom"}
                url={fields.url}
              >
                {serializedChildren}
              </CMSLink>
            );
          }

          default:
            return null;
        }
      }
    ) ?? []
  );

  return (
    <>
      {/* biome-ignore lint/suspicious/noArrayIndexKey: Lexical nodes are stable and ordered in the document tree */}
      {serializedNodes.map((node, index) => (
        <React.Fragment key={index}>{node}</React.Fragment>
      ))}
    </>
  );
}
