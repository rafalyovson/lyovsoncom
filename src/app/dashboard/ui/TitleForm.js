"use client";

import { slugify } from "@/app/lib/utils";
import { useState } from "react";

const TitleForm = () => {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  return (
    <>
      <label className="flex flex-col space-y-2">
        <span className="text-lg font-medium">Title:</span>
        <input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>
      <label className="flex flex-col space-y-2">
        <span className="text-lg font-medium">Slug:</span>
        <input
          name="slug"
          type="text"
          value={slugify(title)}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </label>
    </>
  );
};

export default TitleForm;
