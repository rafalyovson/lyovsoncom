import { revalidatePath, updateTag } from "next/cache";
import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const Topics: CollectionConfig = {
  slug: "topics",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "parent"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "color",
      type: "text",
      admin: {
        description:
          "Hex color code (e.g. #FF0000). Leave empty to inherit from parent.",
      },
    },
    ...slugField("name"),
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // If no color is set and there's a parent, inherit parent's color
        if (!data.color && data.parent) {
          const parentTopic = await req.payload.findByID({
            collection: "topics",
            id: data.parent,
          });
          if (parentTopic && "color" in parentTopic && parentTopic.color) {
            data.color = parentTopic.color;
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Updating cache for topic: ${doc.slug}`);

        // Update topic-related cache tags with immediate refresh
        updateTag("topics");
        updateTag(`topic-${doc.slug}`);
        updateTag("posts"); // Posts may reference this topic
        updateTag("sitemap");

        // Revalidate topic path
        revalidatePath(`/topics/${doc.slug}`);
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        req.payload.logger.info(
          `Updating cache after topic deletion: ${doc?.slug}`
        );

        // Update topic-related cache tags with immediate refresh
        updateTag("topics");
        updateTag(`topic-${doc?.slug}`);
        updateTag("posts"); // Posts may reference this topic
        updateTag("sitemap");

        // Revalidate topic path
        revalidatePath(`/topics/${doc?.slug}`);
      },
    ],
  },
};
