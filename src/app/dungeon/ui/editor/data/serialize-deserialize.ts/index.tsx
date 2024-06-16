import React from "react";
import { XEmbed } from "./x-embed";
import { YouTubeEmbed } from "./youtube-embed";

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
  let element: JSX.Element;
  const style = node.format ? { textAlign: node.format } : {};

  switch (node.type) {
    case "root":
      element = <div style={style}>{node.children?.map(createJSXElement)}</div>;
      break;
    case "paragraph":
      element = <p style={style}>{node.children?.map(createJSXElement)}</p>;
      break;
    case "heading":
      element = React.createElement(
        `h${node.tag}`,
        { style },
        node.children?.map(createJSXElement)
      );
      break;
    case "link":
      element = (
        <a href={node.url} style={style}>
          {node.children?.map(createJSXElement)}
        </a>
      );
      break;
    case "text":
      let textElement: JSX.Element | string = node.text ?? "";
      textElement = applyFormatting(textElement, node.format);
      element = <>{textElement}</>;
      break;
    case "list":
      element = node.ordered ? (
        <ol style={style}>{node.children?.map(createJSXElement)}</ol>
      ) : (
        <ul style={style}>{node.children?.map(createJSXElement)}</ul>
      );
      break;
    case "listitem":
      element = <li style={style}>{node.children?.map(createJSXElement)}</li>;
      break;
    case "blockquote":
      element = (
        <blockquote style={style}>
          {node.children?.map(createJSXElement)}
        </blockquote>
      );
      break;
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      element = <img src={node.src} alt={node.alt ?? ""} style={style} />;
      break;
    case "tweet":
      element = <XEmbed url={node.url} />;
      break;
    case "youtube":
      element = <YouTubeEmbed url={node.url} />;
      break;
    default:
      element = (
        <span style={style}>
          {node.children?.map(createJSXElement) ?? null}
        </span>
      );
  }

  return element;
};

export const parseLexicalJSON = (json: any) => {
  return createJSXElement(json.root);
};
