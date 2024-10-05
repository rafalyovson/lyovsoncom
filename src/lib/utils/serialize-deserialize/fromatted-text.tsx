// FormattedText.tsx
import React, { FC, ReactElement } from 'react';

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

type Format = string;
type FormattedTextProps = {
  text: string | ReactElement;
  format?: Format;
};

export const FormattedText: FC<FormattedTextProps> = ({ text, format }) => {
  let formattedText = text;

  if (format) {
    if (+format & FORMATS.BOLD)
      formattedText = <b className="text-gray-100">{formattedText}</b>;
    if (+format & FORMATS.ITALIC) formattedText = <i>{formattedText}</i>;
    if (+format & FORMATS.UNDERLINE) formattedText = <u>{formattedText}</u>;
    if (+format & FORMATS.STRIKETHROUGH) formattedText = <s>{formattedText}</s>;
    if (+format & FORMATS.CODE)
      formattedText = (
        <code className="text-yellow-300 bg-[#2c2c2e] px-1 py-0.5 rounded-md">
          {formattedText}
        </code>
      );
    if (+format & FORMATS.SUBSCRIPT) formattedText = <sub>{formattedText}</sub>;
    if (+format & FORMATS.SUPERSCRIPT)
      formattedText = <sup>{formattedText}</sup>;
    if (+format & FORMATS.HIGHLIGHT)
      formattedText = <mark className="bg-yellow-500">{formattedText}</mark>;
  }

  return <>{formattedText}</>;
};
