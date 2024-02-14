"use client";

import { slugify } from "@/app/dungeon/lib/utils";
import { useState } from "react";

const TitleForm = ({ value }: { value?: string }) => {
  const [_, setSlug] = useState("");
  const [title, setTitle] = useState(value || "");
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
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-beige"
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
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-beige"
        />
      </label>
    </>
  );
};

export default TitleForm;
