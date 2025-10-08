import {
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionConfig } from "payload";

import { authenticated } from "@/access/authenticated";

export const Lyovsons: CollectionConfig = {
  slug: "lyovsons",
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["avatar", "name", "username", "email"],
    useAsTitle: "name",
    description: "Lyovson family members",
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: false, // default: false
    },
  },
  fields: [
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: {
        position: "sidebar",
        description: "Profile picture for this user",
      },
    },
    {
      name: "font",
      type: "select",
      required: false,
      defaultValue: "sans",
      options: [
        { label: "Sans Serif", value: "sans" },
        { label: "Serif", value: "serif" },
        { label: "Monospace", value: "mono" },
      ],
      admin: {
        position: "sidebar",
        description: "Preferred font family for this user's page",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          description: "Basic profile information",
          fields: [
            {
              name: "name",
              type: "text",
              saveToJWT: true,
              required: true,
              admin: {
                description: "Full name of the user",
              },
            },
            {
              name: "username",
              type: "text",
              unique: true,
              required: true,
              admin: {
                description: "Unique username for this user",
                placeholder: "johndoe",
              },
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
          ],
        },
        {
          label: "Social",
          description: "Biography and social media links",
          fields: [
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
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (doc.username) {
          req.payload.logger.info(`Revalidating author: ${doc.username}`);

          // Revalidate lyovson-related cache tags
          revalidateTag("lyovsons");
          revalidateTag(`lyovson-${doc.username}`);
          revalidateTag("posts"); // Posts may reference this author
          revalidateTag("sitemap");

          // Revalidate author page path
          revalidatePath(`/${doc.username}`);
        }
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        if (doc?.username) {
          req.payload.logger.info(
            `Revalidating after user deletion: ${doc.username}`
          );

          // Revalidate lyovson-related cache tags
          revalidateTag("lyovsons");
          revalidateTag(`lyovson-${doc.username}`);
          revalidateTag("posts"); // Posts may reference this author
          revalidateTag("sitemap");

          // Revalidate author page path
          revalidatePath(`/${doc.username}`);
        }
      },
    ],
  },
  timestamps: true,
};
