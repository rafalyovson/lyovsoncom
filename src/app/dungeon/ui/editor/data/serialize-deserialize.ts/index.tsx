import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement, Suspense } from 'react';
import { XEmbed } from './x-embed';
import { YouTubeEmbed } from './youtube-embed';

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

export const isInternalLink = (url: string) => {
  return (
    url.startsWith('/') ||
    url.startsWith('https://lyovson.com') ||
    url.startsWith('https://www.lyovson.com')
  );
};

export const applyFormatting = (textElement: any, format: any) => {
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

export const createJSXElement = (node: any) => {
  let element: ReactElement;

  const className = node.format ? `text-${node.format}` : '';

  switch (node.type) {
    case 'root':
      element = (
        <main className={`${className}`}>
          {node.children?.map(createJSXElement)}
        </main>
      );
      break;

    case 'paragraph':
      if (node.children?.length === 1 && node.children[0].type === 'image') {
        element = (
          <Suspense fallback={null}>
            <Card>
              <CardContent className="">
                <Image
                  className={`${className} w-full`}
                  src={node.children[0].src}
                  alt={node.children[0].alt ?? ''}
                  width={1920}
                  height={1080}
                />
              </CardContent>

              <CardFooter className="flex flex-row items-center  text-xs text-muted-foreground">
                {node.children[0].caption}
              </CardFooter>
            </Card>
          </Suspense>
        );
      } else {
        element = (
          <p className={`${className}`}>
            {node.children?.map(createJSXElement)}
          </p>
        );
      }
      break;

    case 'heading':
      element = React.createElement(
        `${node.tag}`,
        { className: `§{className}` },
        node.children?.map(createJSXElement),
      );
      break;

    case 'link':
      element = isInternalLink(node.url) ? (
        <Link className={`${className} `} href={node.url}>
          {node.children?.map(createJSXElement)}
        </Link>
      ) : (
        <a className={`${className}`} href={node.url}>
          {node.children?.map(createJSXElement)}
        </a>
      );
      break;

    case 'text':
      let textElement: JSX.Element | string = node.text ?? '';
      textElement = applyFormatting(textElement, node.format);
      element = <>{textElement}</>;
      break;

    case 'list':
      element = node.ordered ? (
        <ol className={`${className}`}>
          {node.children?.map(createJSXElement)}
        </ol>
      ) : (
        <ul className={`${className}`}>
          {node.children?.map(createJSXElement)}
        </ul>
      );
      break;

    case 'listitem':
      element = (
        <li className={`${className}`}>
          {node.children?.map(createJSXElement)}
        </li>
      );
      break;

    case 'blockquote':
      element = (
        <blockquote className={`${className}`}>
          {node.children?.map(createJSXElement)}
        </blockquote>
      );
      break;

    case 'image':
      element = (
        <Suspense fallback={null}>
          <Card>
            <CardContent className="">
              <Image
                className={`${className} w-full`}
                src={node.children[0].src}
                alt={node.children[0].alt ?? ''}
                width={1920}
                height={1080}
              />
            </CardContent>

            <CardFooter className="flex flex-row items-center  text-xs text-muted-foreground">
              {node.caption}
            </CardFooter>
          </Card>
        </Suspense>
      );
      break;

    case 'tweet':
      element = <XEmbed url={node.url} />;
      break;

    case 'youtube':
      element = <YouTubeEmbed url={node.url} />;
      break;

    default:
      element = (
        <span className={`${className}`}>
          {node.children?.map(createJSXElement) ?? null}
        </span>
      );
  }

  return element;
};

export const parseLexicalJSON = (json: any) => {
  return createJSXElement(json.root);
};
