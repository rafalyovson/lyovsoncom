import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

// Regex patterns for Tenor embed parsing
const TENOR_POST_ID_REGEX = /data-postid="(\d+)"/;
const TENOR_ASPECT_RATIO_REGEX = /data-aspect-ratio="([^"]+)"/;

// Validate and extract Tenor embed info
const extractTenorInfo = (
  embedCode: string
): { postId: string; aspectRatio: string } | null => {
  try {
    const postIdMatch = embedCode.match(TENOR_POST_ID_REGEX);
    const aspectRatioMatch = embedCode.match(TENOR_ASPECT_RATIO_REGEX);

    if (!postIdMatch) {
      return null;
    }

    return {
      postId: postIdMatch[1],
      aspectRatio: aspectRatioMatch?.[1] || "1",
    };
  } catch (_e) {
    return null;
  }
};

export const GIF: Block = {
  slug: "gif",
  interfaceName: "GIFBlock",
  fields: [
    {
      name: "embedCode",
      type: "group",
      fields: [
        {
          name: "gifPicker",
          type: "ui",
          admin: {
            components: {
              Field: "@/blocks/GIF/GifPicker#GifPicker",
            },
          },
        },
        {
          name: "raw",
          type: "textarea",
          required: false,
          label: "Or paste Tenor embed code",
          admin: {
            description:
              "Fallback option: Paste the full embed code from Tenor (click Share > Embed)",
          },
          hooks: {
            beforeValidate: [
              ({ value }) => {
                if (!value) {
                  return value;
                }
                const info = extractTenorInfo(value);
                if (!info) {
                  throw new Error("Please enter a valid Tenor embed code");
                }
                // Store both the raw embed code and the extracted info
                return value;
              },
            ],
          },
        },
        {
          name: "postId",
          type: "text",
          admin: {
            hidden: true,
          },
        },
        {
          name: "aspectRatio",
          type: "text",
          admin: {
            hidden: true,
          },
        },
      ],
      hooks: {
        beforeChange: [
          ({ value }) => {
            // If postId is already set (from picker), preserve it
            if (value?.postId && !value?.raw) {
              return value;
            }

            // If raw embed code exists, extract and use that
            if (!value?.raw) {
              return value;
            }

            const info = extractTenorInfo(value.raw);
            if (!info) {
              return value;
            }

            return {
              raw: value.raw,
              ...info,
            };
          },
        ],
      },
    },
    {
      name: "caption",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: "Caption",
    },
  ],
};
