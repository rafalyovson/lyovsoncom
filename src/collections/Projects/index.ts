import { revalidatePath, updateTag } from "next/cache";
import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const Projects: CollectionConfig = {
  slug: "projects",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "resendAudienceId"],
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
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "resendAudienceId",
      type: "text",
      label: "Resend Audience ID",
      defaultValue: process.env.RESEND_AUDIENCE_ID,
      admin: {
        description:
          "The Audience ID from Resend for managing newsletter subscriptions.",
      },
    },
    {
      name: "contacts",
      type: "relationship",
      relationTo: "contacts",
      hasMany: true,
      admin: {
        description: "List of contacts associated with this project.",
      },
    },
    ...slugField("name"),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Updating cache for project: ${doc.slug}`);

        // Update project-related cache tags with immediate refresh
        updateTag("projects");
        updateTag(`project-${doc.slug}`);
        updateTag("posts"); // Posts may reference this project
        updateTag("sitemap");
        updateTag("playground"); // Playground uses project data

        // Revalidate project paths
        revalidatePath(`/projects/${doc.slug}`);
        revalidatePath("/projects"); // Listing page
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        req.payload.logger.info(
          `Updating cache after project deletion: ${doc?.slug}`
        );

        // Update project-related cache tags with immediate refresh
        updateTag("projects");
        updateTag(`project-${doc?.slug}`);
        updateTag("posts"); // Posts may reference this project
        updateTag("sitemap");
        updateTag("playground"); // Playground uses project data

        // Revalidate project paths
        revalidatePath(`/projects/${doc?.slug}`);
        revalidatePath("/projects"); // Listing page
      },
    ],
  },
};
