import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { slugField } from "@/fields/slug";

export const Music: CollectionConfig = {
  slug: "music",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "releaseDate", "updatedAt"],
    description: "Manage albums, songs, and soundtracks",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "The title of the album or song",
      },
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Album", value: "album" },
        { label: "Song", value: "song" },
        { label: "Soundtrack", value: "soundtrack" },
      ],
      defaultValue: "album",
      required: true,
      admin: {
        position: "sidebar",
        description: "What type of music content is this?",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Description or notes about this music",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Album art or cover image",
      },
    },
    {
      name: "artists",
      type: "relationship",
      relationTo: "persons",
      hasMany: true,
      admin: {
        position: "sidebar",
        description: "Artists, musicians, composers, etc.",
      },
    },
    {
      name: "duration",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Duration in seconds",
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
      name: "genre",
      type: "select",
      hasMany: true,
      options: [
        { label: "Rock", value: "rock" },
        { label: "Pop", value: "pop" },
        { label: "Hip Hop", value: "hip-hop" },
        { label: "Electronic", value: "electronic" },
        { label: "Jazz", value: "jazz" },
        { label: "Classical", value: "classical" },
        { label: "Country", value: "country" },
        { label: "R&B", value: "rnb" },
        { label: "Folk", value: "folk" },
        { label: "Indie", value: "indie" },
        { label: "Alternative", value: "alternative" },
        { label: "Soundtrack", value: "soundtrack" },
      ],
      admin: {
        position: "sidebar",
        description: "Music genres",
      },
    },
    {
      name: "spotifyId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Spotify track/album ID",
      },
    },
    {
      name: "appleMusicId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Apple Music ID",
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
        description: "Full API response data from streaming services",
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        req.payload.logger.info(`Revalidating music: ${doc.slug}`);
        // TODO: Add revalidation logic for music when we have music pages
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
