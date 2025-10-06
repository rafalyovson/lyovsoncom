import type { CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Links: CollectionConfig = {
  slug: "links",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "type", "url", "referenceType"],
    description: "Manage web links, articles, and external references",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      admin: {
        description: "Description of what this link is",
      },
    },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Website", value: "website" },
        { label: "Article", value: "article" },
        { label: "Video", value: "video" },
        { label: "YouTube Video", value: "youtube" },
        { label: "Social Media", value: "social_media" },
        { label: "Documentation", value: "documentation" },
        { label: "Tool/App", value: "tool" },
        { label: "Repository", value: "repository" },
      ],
      defaultValue: "website",
      required: true,
      admin: {
        position: "sidebar",
        description: "What type of link is this?",
      },
    },
    {
      name: "url",
      type: "text",
      required: true,
      admin: {
        description: "The URL this link points to",
      },
    },
    {
      name: "referenceType",
      type: "select",
      options: [
        { label: "Book", value: "books" },
        { label: "Movie", value: "movies" },
        { label: "TV Show", value: "tvShows" },
        { label: "Video Game", value: "videoGames" },
        { label: "Music", value: "music" },
        { label: "Podcast", value: "podcasts" },
        { label: "Post", value: "posts" },
        { label: "Person", value: "persons" },
        { label: "Note", value: "notes" },
        { label: "Project", value: "projects" },
      ],
      required: true,
      admin: {
        description: "What type of content is this link attached to?",
      },
    },
    {
      name: "reference",
      type: "relationship",
      relationTo: [
        "books",
        "movies",
        "tvShows",
        "videoGames",
        "music",
        "podcasts",
        "posts",
        "persons",
        "notes",
        "projects",
      ],
      required: true,
      admin: {
        description: "The specific item this link is attached to",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Additional details about this link",
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
      name: "tags",
      type: "text",
      hasMany: true,
      admin: {
        description: "Tags for this link",
      },
    },
  ],
};
