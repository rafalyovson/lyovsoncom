import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const Podcasts: CollectionConfig = {
  slug: "podcasts",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "episodeTitle",
    defaultColumns: [
      "episodeTitle",
      "showTitle",
      "type",
      "releaseDate",
      "updatedAt",
    ],
    description: "Manage podcast episodes and shows",
  },
  fields: [
    {
      name: "episodeTitle",
      type: "text",
      required: true,
      admin: {
        description: "The title of the podcast episode",
      },
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Episode", value: "episode" },
        { label: "Show", value: "show" },
      ],
      defaultValue: "episode",
      required: true,
      admin: {
        position: "sidebar",
        description: "Is this an episode or show-level entry?",
      },
    },
    {
      name: "showTitle",
      type: "text",
      required: true,
      admin: {
        description: "The name of the podcast show",
      },
    },
    {
      name: "episodeNumber",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Episode number (if applicable)",
        condition: (data) => data.type === "episode",
      },
    },
    {
      name: "seasonNumber",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Season number (if applicable)",
        condition: (data) => data.type === "episode",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Episode description or show notes",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Podcast artwork or episode image",
      },
    },
    {
      name: "hosts",
      type: "relationship",
      relationTo: "persons",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Podcast hosts",
      },
    },
    {
      name: "guests",
      type: "relationship",
      relationTo: "persons",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Episode guests",
        condition: (data) => data.type === "episode",
      },
    },
    {
      name: "duration",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Duration in seconds",
        condition: (data) => data.type === "episode",
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
        description: "Episode release date",
      },
    },
    {
      name: "genre",
      type: "select",
      hasMany: true,
      options: [
        { label: "Technology", value: "technology" },
        { label: "Business", value: "business" },
        { label: "Comedy", value: "comedy" },
        { label: "Education", value: "education" },
        { label: "News", value: "news" },
        { label: "Society & Culture", value: "society-culture" },
        { label: "Science", value: "science" },
        { label: "Health & Fitness", value: "health-fitness" },
        { label: "Arts", value: "arts" },
        { label: "True Crime", value: "true-crime" },
        { label: "History", value: "history" },
        { label: "Sports", value: "sports" },
      ],
      admin: {
        position: "sidebar",
        description: "Podcast genres/categories",
      },
    },
    {
      name: "spotifyUrl",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Spotify episode URL",
        placeholder: "https://open.spotify.com/episode/...",
      },
    },
    {
      name: "applePodcastsUrl",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Apple Podcasts URL",
        placeholder: "https://podcasts.apple.com/...",
      },
    },
    {
      name: "websiteUrl",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Official podcast website URL",
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
      name: "listenStatus",
      type: "select",
      options: [
        { label: "Want to Listen", value: "want_to_listen" },
        { label: "Listening", value: "listening" },
        { label: "Listened", value: "listened" },
      ],
      admin: {
        position: "sidebar",
        description: "Listen status",
      },
    },
    {
      name: "apiData",
      type: "json",
      admin: {
        position: "sidebar",
        description: "Full API response data from podcast platforms",
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating podcast: ${doc.slug}`);
        // TODO: Add revalidation logic for podcasts when we have podcast pages
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
