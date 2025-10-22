import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

export const GIF: Block = {
  slug: "gif",
  interfaceName: "GIFBlock",
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
      name: "mp4Url",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "webmUrl",
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "posterUrl",
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
    // Legacy fields for backwards compatibility with old GIFs
    {
      name: "embedCode",
      type: "group",
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: "postId",
          type: "text",
          admin: {
            hidden: true,
          },
        },
        {
          name: "raw",
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
