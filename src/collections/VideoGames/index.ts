import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const VideoGames: CollectionConfig = {
  slug: "videoGames",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "releaseDate", "updatedAt"],
    description: "Manage video games, DLC, and expansions",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "The title of the video game",
      },
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Game", value: "game" },
        { label: "DLC", value: "dlc" },
        { label: "Expansion", value: "expansion" },
      ],
      defaultValue: "game",
      required: true,
      admin: {
        position: "sidebar",
        description: "What type of video game content is this?",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Game description or summary",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Game cover or poster image",
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
        description: "Developers, publishers, designers, etc.",
      },
    },
    {
      name: "platforms",
      type: "select",
      hasMany: true,
      options: [
        { label: "PC", value: "pc" },
        { label: "PlayStation", value: "playstation" },
        { label: "Xbox", value: "xbox" },
        { label: "Nintendo Switch", value: "switch" },
        { label: "Mobile", value: "mobile" },
        { label: "VR", value: "vr" },
      ],
      admin: {
        position: "sidebar",
        description: "Gaming platforms",
      },
    },
    {
      name: "genre",
      type: "select",
      hasMany: true,
      options: [
        { label: "Action", value: "action" },
        { label: "Adventure", value: "adventure" },
        { label: "RPG", value: "rpg" },
        { label: "Strategy", value: "strategy" },
        { label: "Simulation", value: "simulation" },
        { label: "Sports", value: "sports" },
        { label: "Racing", value: "racing" },
        { label: "Puzzle", value: "puzzle" },
        { label: "Horror", value: "horror" },
        { label: "Indie", value: "indie" },
      ],
      admin: {
        position: "sidebar",
        description: "Game genres",
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
      name: "playStatus",
      type: "select",
      options: [
        { label: "Want to Play", value: "want_to_play" },
        { label: "Playing", value: "playing" },
        { label: "Completed", value: "completed" },
        { label: "Abandoned", value: "abandoned" },
      ],
      admin: {
        position: "sidebar",
        description: "Play status",
      },
    },
    {
      name: "esrbRating",
      type: "select",
      options: [
        { label: "E - Everyone", value: "e" },
        { label: "E10+ - Everyone 10+", value: "e10" },
        { label: "T - Teen", value: "t" },
        { label: "M - Mature", value: "m" },
        { label: "AO - Adults Only", value: "ao" },
      ],
      admin: {
        position: "sidebar",
        description: "ESRB rating",
      },
    },
    {
      name: "metacriticScore",
      type: "number",
      min: 0,
      max: 100,
      admin: {
        position: "sidebar",
        description: "Metacritic score",
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
        req.payload.logger.info(`Revalidating video game: ${doc.slug}`);
        // TODO: Add revalidation logic for video games when we have game pages
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
