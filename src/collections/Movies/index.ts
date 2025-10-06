import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const Movies: CollectionConfig = {
  slug: "movies",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "releaseDate", "updatedAt"],
    description: "Manage movies, documentaries, and short films",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "The title of the movie",
      },
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Movie", value: "movie" },
        { label: "Documentary", value: "documentary" },
        { label: "Short Film", value: "short_film" },
      ],
      defaultValue: "movie",
      required: true,
      admin: {
        position: "sidebar",
        description: "What type of film is this?",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Plot summary or description",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Movie poster image",
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
        description: "Release date",
      },
    },
    {
      name: "creators",
      type: "relationship",
      relationTo: "persons",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Directors, writers, actors, etc.",
      },
    },
    {
      name: "genre",
      type: "select",
      hasMany: true,
      options: [
        { label: "Action", value: "action" },
        { label: "Comedy", value: "comedy" },
        { label: "Drama", value: "drama" },
        { label: "Horror", value: "horror" },
        { label: "Sci-Fi", value: "sci-fi" },
        { label: "Romance", value: "romance" },
        { label: "Thriller", value: "thriller" },
        { label: "Documentary", value: "documentary" },
        { label: "Animation", value: "animation" },
        { label: "Family", value: "family" },
      ],
      admin: {
        position: "sidebar",
        description: "Movie genres",
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
      name: "watchStatus",
      type: "select",
      options: [
        { label: "Want to Watch", value: "want_to_watch" },
        { label: "Watching", value: "watching" },
        { label: "Watched", value: "watched" },
      ],
      admin: {
        position: "sidebar",
        description: "Watch status",
      },
    },
    {
      name: "omdbId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "OMDB API ID",
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
        req.payload.logger.info(`Revalidating movie: ${doc.slug}`);
        // TODO: Add revalidation logic for movies when we have movie pages
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
