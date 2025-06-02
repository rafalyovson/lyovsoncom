import React, { Fragment, JSX } from 'react'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'

import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'

import { BannerBlock } from '@/blocks/Banner/Component'
import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { CMSLink } from '@/components/Link'
import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import type { GIFBlock as GIFBlockProps } from '@/blocks/GIF/types'
import type {
  MediaBlock as MediaBlockProps,
  YouTubeBlock as YouTubeBlockProps,
  XPostBlock as XPostBlockProps,
  QuoteBlock as QuoteBlockProps,
} from '@/payload-types'
import { YouTubeBlock } from '@/blocks/YouTube/Component'
import { XPostBlock } from '@/blocks/XPost/Component'
import { QuoteBlock } from '@/blocks/Quote/Component'
import { GIFBlock } from '@/blocks/GIF/Component'

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
    >

type Props = {
  nodes: NodeTypes[]
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} className="line-through">
                {text}
              </span>
            )
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} className="underline">
                {text}
              </span>
            )
          }
          if (node.format & IS_CODE) {
            text = (
              <code key={index} className="px-1 py-0.5 text-sm font-mono rounded bg-muted">
                {node.text}
              </code>
            )
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: NodeTypes): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({ nodes: node.children as NodeTypes[] })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        if (node.type === 'block') {
          const block = node.fields

          const blockType = block?.blockType

          if (!block || !blockType) {
            return null
          }

          switch (blockType) {
            case 'mediaBlock':
              return (
                <div key={index} className="col-start-1 col-span-3 glass-stagger-1">
                  <MediaBlock
                    className="glass-section"
                    imgClassName="m-0 w-full rounded-lg"
                    {...block}
                    captionClassName="mx-auto max-w-[48rem] mt-4 glass-text-secondary text-center"
                    enableGutter={false}
                    disableInnerContainer={true}
                  />
                </div>
              )
            case 'banner':
              return (
                <div key={index} className="col-start-2 mb-6 glass-stagger-2">
                  <BannerBlock className="glass-section glass-interactive" {...block} />
                </div>
              )
            case 'code':
              return (
                <div key={index} className="col-start-2 glass-stagger-2">
                  <CodeBlock className="glass-section font-mono" {...block} />
                </div>
              )
            case 'youtube':
              return (
                <div
                  key={index}
                  className="col-start-1 col-span-3 glass-stagger-1 glass-section rounded-lg overflow-hidden"
                >
                  <YouTubeBlock {...block} />
                </div>
              )
            case 'xpost':
              return (
                <div
                  key={index}
                  className="col-start-2 glass-stagger-2 glass-section glass-interactive"
                >
                  <XPostBlock {...block} />
                </div>
              )
            case 'quote':
              return (
                <div key={index} className="col-start-2 glass-stagger-2">
                  <QuoteBlock className="glass-section glass-premium" {...block} />
                </div>
              )
            case 'gif':
              return (
                <div
                  key={index}
                  className="col-start-1 col-span-3 glass-stagger-1 glass-section rounded-lg overflow-hidden"
                >
                  <GIFBlock {...block} />
                </div>
              )
            default:
              return null
          }
        } else {
          switch (node.type) {
            case 'linebreak': {
              return <br className="col-start-2" key={index} />
            }
            case 'paragraph': {
              return (
                <p className="col-start-2" key={index}>
                  {serializedChildren}
                </p>
              )
            }
            case 'heading': {
              const Tag = node?.tag
              return (
                <Tag className="col-start-2" key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'list': {
              const Tag = node?.tag
              return (
                <Tag className="col-start-2" key={index}>
                  {serializedChildren}
                </Tag>
              )
            }
            case 'listitem': {
              if (node?.checked != null) {
                return (
                  <li
                    aria-checked={node.checked ? 'true' : 'false'}
                    className={`${node.checked ? 'line-through opacity-60' : ''}`}
                    key={index}
                    role="checkbox"
                    tabIndex={-1}
                    value={node?.value}
                  >
                    <span className="mr-2">{node.checked ? '✅' : '☐'}</span>
                    {serializedChildren}
                  </li>
                )
              } else {
                return (
                  <li key={index} value={node?.value}>
                    {serializedChildren}
                  </li>
                )
              }
            }
            case 'quote': {
              return (
                <blockquote className="col-start-2" key={index}>
                  {serializedChildren}
                </blockquote>
              )
            }
            case 'link': {
              const fields = node.fields

              return (
                <CMSLink
                  key={index}
                  newTab={Boolean(fields?.newTab)}
                  reference={fields.doc as any}
                  type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                  url={fields.url}
                  className="underline hover:no-underline transition-colors duration-300"
                >
                  {serializedChildren}
                </CMSLink>
              )
            }

            default:
              return null
          }
        }
      })}
    </Fragment>
  )
}
