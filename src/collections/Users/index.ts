import {
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { revalidateTag } from "next/cache";
import type { CollectionConfig } from "payload";

import { authenticated } from "@/access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "name",
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      saveToJWT: true,
    },
    {
      name: "username",
      type: "text",
      unique: true,
    },
    {
      name: "quote",
      type: "text",
      required: false,
      maxLength: 150,
      admin: {
        description: "A short tagline or quote (like X/Facebook bio)",
        placeholder: "Your tagline here...",
      },
    },
    {
      name: "bio",
      type: "richText",
      required: false,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({
              enabledHeadingSizes: ["h2", "h3"],
            }),
            InlineToolbarFeature(),
          ];
        },
      }),
      admin: {
        description: "A brief biography or description about this user",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      required: false,
      admin: {
        description: "Social media profiles and links",
      },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "X", value: "x" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "GitHub", value: "github" },
            { label: "Instagram", value: "instagram" },
            { label: "Facebook", value: "facebook" },
            { label: "YouTube", value: "youtube" },
            { label: "Website", value: "website" },
          ],
        },
        {
          name: "url",
          type: "text",
          required: true,
          admin: {
            placeholder: "https://...",
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (doc.username) {
          req.payload.logger.info(`Revalidating author: ${doc.username}`);

          // Revalidate user-related cache tags
          revalidateTag("users");
          revalidateTag(`author-${doc.username}`);
          revalidateTag("posts"); // Posts may reference this author
        }
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        if (doc?.username) {
          req.payload.logger.info(
            `Revalidating after user deletion: ${doc.username}`
          );

          // Revalidate user-related cache tags
          revalidateTag("users");
          revalidateTag(`author-${doc.username}`);
          revalidateTag("posts"); // Posts may reference this author
        }
      },
    ],
  },
  timestamps: true,
};
