import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const Books: CollectionConfig = {
  slug: "books",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    coverImage: true,
    description: true,
    creators: true,
    type: true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "releaseDate", "updatedAt"],
    description: "Manage books, series, and comics for reviews and references",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "The title of the book",
      },
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Book", value: "book" },
        { label: "Series", value: "series" },
        { label: "Comics", value: "comics" },
      ],
      defaultValue: "book",
      required: true,
      admin: {
        position: "sidebar",
        description: "What type of publication is this?",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Brief description or summary of the book",
        placeholder: "What is this book about?",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Book cover image",
      },
    },
    {
      name: "releaseDate",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        },
        description: "Publication date",
      },
    },
    {
      name: "creators",
      type: "relationship",
      relationTo: "persons",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Authors, illustrators, etc.",
      },
    },
    {
      name: "isbn",
      type: "text",
      admin: {
        position: "sidebar",
        description: "ISBN number",
      },
    },
    {
      name: "genre",
      type: "select",
      hasMany: true,
      options: [
        { label: "Fiction", value: "fiction" },
        { label: "Non-Fiction", value: "non-fiction" },
        { label: "Science Fiction", value: "sci-fi" },
        { label: "Fantasy", value: "fantasy" },
        { label: "Mystery", value: "mystery" },
        { label: "Romance", value: "romance" },
        { label: "Thriller", value: "thriller" },
        { label: "Biography", value: "biography" },
        { label: "History", value: "history" },
        { label: "Self-Help", value: "self-help" },
        { label: "Technical", value: "technical" },
      ],
      admin: {
        position: "sidebar",
        description: "Book genres",
      },
    },
    {
      name: "familyRating",
      type: "number",
      min: 1,
      max: 10,
      admin: {
        position: "sidebar",
        description: "Family rating (1-10)",
      },
    },
    {
      name: "readStatus",
      type: "select",
      options: [
        { label: "Want to Read", value: "want_to_read" },
        { label: "Reading", value: "reading" },
        { label: "Read", value: "read" },
        { label: "Abandoned", value: "abandoned" },
      ],
      admin: {
        position: "sidebar",
        description: "Reading status",
      },
    },
    {
      name: "googleBooksId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Google Books API ID",
      },
    },
    {
      name: "apiData",
      type: "json",
      admin: {
        position: "sidebar",
        description: "Full API response data",
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating book: ${doc.slug}`);
        // TODO: Add revalidation logic for books when we have book pages
      },
    ],
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
