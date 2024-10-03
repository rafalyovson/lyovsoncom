import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { XEmbed } from './x-embed';
import { YouTubeEmbed } from './youtube-embed';

// Define the formatting options as bitwise flags
export const FORMATS = {
  BOLD: 1,
  ITALIC: 1 << 1,
  STRIKETHROUGH: 1 << 2,
  UNDERLINE: 1 << 3,
  CODE: 1 << 4,
  SUBSCRIPT: 1 << 5,
  SUPERSCRIPT: 1 << 6,
  HIGHLIGHT: 1 << 7,
};

// Define Node type based on the structure used in your components
export type Node = {
  type: string;
  tag?: string;
  format?: number;
  children?: Node[];
  text?: string;
  url?: string;
  ordered?: boolean;
  caption?: string;
  src?: string;
  alt?: string;
};

// Check if a URL is internal (belongs to the same domain)
export const isInternalLink = (url: string) => {
  return (
    url.startsWith('/') ||
    url.startsWith('https://lyovson.com') ||
    url.startsWith('https://www.lyovson.com')
  );
};

// Apply text formatting based on the format bitmask
export const applyFormatting = (
  textElement: JSX.Element | string,
  format?: number,
): JSX.Element | string => {
  if (format) {
    if (format & FORMATS.BOLD) textElement = <b>{textElement}</b>;
    if (format & FORMATS.ITALIC) textElement = <i>{textElement}</i>;
    if (format & FORMATS.UNDERLINE) textElement = <u>{textElement}</u>;
    if (format & FORMATS.STRIKETHROUGH) textElement = <s>{textElement}</s>;
    if (format & FORMATS.CODE) textElement = <code>{textElement}</code>;
    if (format & FORMATS.SUBSCRIPT) textElement = <sub>{textElement}</sub>;
    if (format & FORMATS.SUPERSCRIPT) textElement = <sup>{textElement}</sup>;
    if (format & FORMATS.HIGHLIGHT) textElement = <mark>{textElement}</mark>;
  }
  return textElement;
};

// Create a JSX element based on the node type
export const createJSXElement = (node: Node): ReactElement => {
  let element: ReactElement;
  const { type, tag, format, children, text, url, ordered, caption, src, alt } =
    node;
  const className = format ? `text-${format}` : '';

  switch (type) {
    case 'root':
      element = (
        <main className={`${className}`}>
          {children?.map(createJSXElement)}
        </main>
      );
      break;

    case 'paragraph':
      if (children?.length === 1 && children[0].type === 'image') {
        element = (
          <Card>
            <CardContent>
              <Image
                className={`${className} w-full`}
                src={children[0].src!}
                alt={children[0].alt ?? ''}
                width={1920}
                height={1080}
              />
            </CardContent>
            <CardFooter className="flex flex-row items-center text-xs text-muted-foreground">
              {children[0].caption}
            </CardFooter>
          </Card>
        );
      } else {
        element = (
          <p className={`${className}`}>{children?.map(createJSXElement)}</p>
        );
      }
      break;

    case 'heading':
      element = React.createElement(
        tag ?? 'div',
        { className: `${className}` },
        children?.map(createJSXElement),
      );
      break;

    case 'link':
      element = isInternalLink(url ?? '') ? (
        <Link className={`${className}`} href={{ pathname: url ?? '#' }}>
          {children?.map(createJSXElement)}
        </Link>
      ) : (
        <a
          className={`${className}`}
          href={url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children?.map(createJSXElement)}
        </a>
      );
      break;

    case 'text':
      let textElement: JSX.Element | string = text ?? '';
      textElement = applyFormatting(textElement, format);
      element = <>{textElement}</>;
      break;

    case 'list':
      element = ordered ? (
        <ol className={`${className}`}>{children?.map(createJSXElement)}</ol>
      ) : (
        <ul className={`${className}`}>{children?.map(createJSXElement)}</ul>
      );
      break;

    case 'listitem':
      element = (
        <li className={`${className}`}>{children?.map(createJSXElement)}</li>
      );
      break;

    case 'blockquote':
      element = (
        <blockquote className={`${className}`}>
          {children?.map(createJSXElement)}
        </blockquote>
      );
      break;

    case 'image':
      element = (
        <Card>
          <CardContent>
            <Image
              className={`${className} w-full`}
              src={src ?? ''}
              alt={alt ?? ''}
              width={1920}
              height={1080}
            />
          </CardContent>
          <CardFooter className="flex flex-row items-center text-xs text-muted-foreground">
            {caption}
          </CardFooter>
        </Card>
      );
      break;

    case 'tweet':
      element = <XEmbed url={url ?? ''} />;
      break;

    case 'youtube':
      element = <YouTubeEmbed url={url ?? ''} />;
      break;

    default:
      console.warn(`Unsupported node type: ${type}`);
      element = (
        <span className={`${className}`}>
          {children?.map(createJSXElement) ?? null}
        </span>
      );
  }

  return element;
};

// Convert the JSON structure into JSX elements
export const parseLexicalJSON = (json: { root: Node }) => {
  return createJSXElement(json.root);
};
