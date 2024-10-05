import { createElement, ReactElement, Suspense } from 'react';
import { XEmbed } from './x-embed';
import { YouTubeEmbed } from './youtube-embed';
import { ImageCard } from './image-card';
import { FormattedText } from './fromatted-text';
import { CustomLink } from './custom-link';
import clsx from 'clsx';
import { SerializedEditorState } from 'lexical';

export type Node = {
  type: string;
  tag?: string;
  format?: string; // Bitmask for text formatting
  children?: Node[];
  text?: string;
  url?: string;
  ordered?: boolean;
  caption?: string;
  src?: string;
  alt?: string;
};

export const createJSXElement = (node: Node): ReactElement => {
  // Destructure properties for clarity
  const { format, children } = node;

  const className = clsx({
    [`text-${format}`]: format,
  });

  const childrenElements = children?.map(createJSXElement) ?? null;

  switch (node.type) {
    case 'root':
      return <main className={className}>{childrenElements}</main>;

    case 'paragraph':
      if (node.children?.length === 1 && node.children[0].type === 'image') {
        return (
          <Suspense fallback={null}>
            <ImageCard
              src={node.children[0].src ?? ''}
              alt={node.children[0].alt ?? ''}
              caption={node.children[0].caption}
            />
          </Suspense>
        );
      }
      return (
        <p className="my-4 text-base text-gray-800 dark:text-gray-200">
          {childrenElements}
        </p>
      );

    case 'heading':
      return createElement(
        node.tag ?? 'div',
        {
          className: clsx(className, {
            'text-4xl font-bold mt-8 mb-4': node.tag === 'h1',
            'text-3xl font-semibold mt-6 mb-3': node.tag === 'h2',
            'text-2xl font-medium mt-4 mb-2': node.tag === 'h3',
          }),
        },
        childrenElements,
      );

    case 'link':
      return (
        <CustomLink url={node.url ?? ''} className={className}>
          {childrenElements}
        </CustomLink>
      );

    case 'text':
      return <FormattedText text={node.text ?? ''} format={node.format} />;

    case 'list':
      return node.ordered ? (
        <ol className="list-decimal pl-8 my-4 space-y-2 text-lg text-gray-800 dark:text-gray-200">
          {childrenElements}
        </ol>
      ) : (
        <ul className="list-disc pl-8 my-4 space-y-2 text-lg text-gray-800 dark:text-gray-200">
          {childrenElements}
        </ul>
      );

    case 'listitem':
      return <li className="my-1">{childrenElements}</li>;

    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-accent pl-4 italic text-gray-600 dark:text-gray-300 my-4">
          {childrenElements}
        </blockquote>
      );

    case 'image':
      return (
        <Suspense fallback={null}>
          <ImageCard
            src={node.src ?? ''}
            alt={node.alt ?? ''}
            caption={node.caption}
          />
        </Suspense>
      );

    case 'tweet':
      return <XEmbed url={node.url!} />;

    case 'youtube':
      return <YouTubeEmbed url={node.url!} />;

    default:
      return <span className={className}>{childrenElements ?? null}</span>;
  }
};

export const parseLexicalJSON = (json: SerializedEditorState) => {
  return createJSXElement(json.root);
};
