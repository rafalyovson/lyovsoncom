import type { CollectionConfig } from "payload";

import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import { richEditorConfig } from "@/fields/lexical-configs";
import { slugField } from "@/fields/slug";
import { generateEmbeddingForActivity } from "@/utilities/generate-embedding-helpers";
import { populateContentTextHook } from "./hooks/populateContentText";
import {
  revalidateActivity,
  revalidateActivityDelete,
} from "./hooks/revalidateActivity";

export const Activities: CollectionConfig = {
  slug: "activities",
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    reference: true,
    activityType: true,
    startedAt: true,
    finishedAt: true,
  },
  admin: {
    group: "Content",
    useAsTitle: "id",
    defaultColumns: [
      "reference",
      "activityType",
      "startedAt",
      "updatedAt",
    ],
    description: "Log reading, watching, listening, and playing activities",
  },
  fields: [
    {
      name: "reference",
      type: "relationship",
      relationTo: "references",
      required: true,
      admin: {
        position: "sidebar",
        description: "What are you reading/watching/listening to/playing?",
      },
    },
    {
      name: "activityType",
      type: "select",
      options: [
        { label: "Read", value: "read" },
        { label: "Watch", value: "watch" },
        { label: "Listen", value: "listen" },
        { label: "Play", value: "play" },
      ],
      required: true,
      admin: {
        position: "sidebar",
        description: "Type of activity",
      },
    },
    {
      name: "participants",
      type: "relationship",
      relationTo: "lyovsons",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Who participated in this activity?",
      },
    },
    {
      name: "startedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "When did you start?",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "finishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "When did you finish?",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "visibility",
      type: "select",
      options: [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
      defaultValue: "public",
      admin: {
        position: "sidebar",
        description: "Who can see this activity?",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Notes",
          fields: [
            {
              name: "notes",
              type: "richText",
              editor: richEditorConfig,
              admin: {
                description:
                  "Your thoughts, review, or notes about this activity",
              },
            },
          ],
        },
        {
          label: "Ratings",
          fields: [
            {
              name: "ratings",
              type: "array",
              admin: {
                description: "Ratings from family members (out of 10)",
              },
              fields: [
                {
                  name: "lyovson",
                  type: "relationship",
                  relationTo: "lyovsons",
                  required: true,
                  admin: {
                    description: "Who is rating this?",
                  },
                },
                {
                  name: "rating",
                  type: "number",
                  min: 1,
                  max: 10,
                  required: true,
                  admin: {
                    description: "Rating out of 10",
                  },
                },
                {
                  name: "comment",
                  type: "textarea",
                  admin: {
                    description: "Optional comment about the rating",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Metadata",
          fields: [
            {
              name: "publishedAt",
              type: "date",
              admin: {
                description: "When this activity should be published",
                date: {
                  pickerAppearance: "dayAndTime",
                },
              },
              hooks: {
                beforeChange: [
                  ({ siblingData, value }) => {
                    if (siblingData._status === "published" && !value) {
                      return new Date();
                    }
                    return value;
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: "slugSource",
      type: "text",
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: slugSource composition depends on related reference title
          async ({ data, operation, req }) => {
            if (operation === "create" || operation === "update") {
              let referenceTitle = "";

              // Fetch reference title if reference is provided
              if (data?.reference) {
                // Handle reference as number (ID), string (ID), or object (populated)
                const referenceId =
                  typeof data.reference === "number"
                    ? data.reference
                    : typeof data.reference === "string"
                      ? data.reference
                      : typeof data.reference === "object" && data.reference !== null && "id" in data.reference
                        ? data.reference.id
                        : null;

                if (referenceId) {
                  try {
                    const reference = await req.payload.findByID({
                      collection: "references",
                      id: referenceId,
                    });
                    referenceTitle = reference?.title || "";
                  } catch (error) {
                    req.payload.logger.error(
                      `Failed to fetch reference ${referenceId} for activity slug: ${error instanceof Error ? error.message : String(error)}`
                    );
                  }
                }
              }

              // Build slug source: just referenceTitle (date will be in URL path)
              if (referenceTitle) {
                return referenceTitle;
              }

              return "";
            }
            return data?.slugSource || "";
          },
        ],
      },
    },
    ...slugField("slugSource", {
      slugOverrides: {
        admin: {
          hidden: true,
        },
      },
    }),
    // Pre-computed embedding for semantic search
    {
      name: "embedding_vector",
      type: "text",
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
        description: "Vector embedding for semantic search (pgvector format)",
      },
    },
    {
      name: "embedding_model",
      type: "text",
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "embedding_dimensions",
      type: "number",
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "embedding_generated_at",
      type: "date",
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "embedding_text_hash",
      type: "text",
      access: {
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    // Extracted plain text from Lexical content for full-text search
    {
      name: "content_text",
      type: "text",
      access: {
        update: () => false, // Only updated via hooks
      },
      admin: {
        hidden: true,
        description:
          "Plain text extracted from activity content for full-text search indexing",
      },
    },
  ],
  hooks: {
    beforeChange: [populateContentTextHook],
    afterChange: [
      revalidateActivity, // Cache revalidation for activities
      // Regenerate slug when reference changes
      async ({ doc, req, operation, previousDoc }) => {
        if (operation === "update") {
          const referenceChanged =
            previousDoc &&
            typeof previousDoc === "object" &&
            "reference" in previousDoc &&
            previousDoc.reference !== doc.reference;

          if (referenceChanged) {
            try {
              // Get the reference ID
              const referenceId =
                typeof doc.reference === "number"
                  ? doc.reference
                  : typeof doc.reference === "string"
                    ? doc.reference
                    : typeof doc.reference === "object" && doc.reference !== null && "id" in doc.reference
                      ? doc.reference.id
                      : null;

              if (referenceId) {
                const reference = await req.payload.findByID({
                  collection: "references",
                  id: referenceId,
                });

                if (reference?.title) {
                  const newSlugSource = reference.title;
                  const { formatSlug } = await import("@/fields/slug/formatSlug");
                  const newSlug = formatSlug(newSlugSource);

                  // Update the activity with new slug
                  await req.payload.update({
                    collection: "activities",
                    id: doc.id,
                    data: {
                      slugSource: newSlugSource,
                      slug: newSlug,
                    },
                  });

                  req.payload.logger.info(
                    `Regenerated slug for activity ${doc.id}: ${newSlug}`
                  );
                }
              }
            } catch (error) {
              req.payload.logger.error(
                `Failed to regenerate slug for activity ${doc.id}: ${error instanceof Error ? error.message : String(error)}`
              );
            }
          }
        }
      },
      // Generate embeddings inline (fire-and-forget)
      ({ doc, req, operation }) => {
        // Only for create/update of published activities
        if (
          (operation === "create" || operation === "update") &&
          doc._status === "published"
        ) {
          // Fire and forget - doesn't block publish response
          generateEmbeddingForActivity(doc.id, req).catch((err) => {
            req.payload.logger.error(
              `[Embedding] Failed for activity ${doc.id}: ${err instanceof Error ? err.message : String(err)}`
            );
          });
        }
      },
    ],
    afterDelete: [revalidateActivityDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30_000,
      },
    },
    maxPerDoc: 5,
  },
};
