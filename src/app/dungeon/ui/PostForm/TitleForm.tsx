"use client";

import { slugify } from "@/app/dungeon/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const TitleForm = ({ value }: { value?: string }) => {
  const [_, setSlug] = useState("");
  const [title, setTitle] = useState(value || "");
  return (
    <section className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <Label htmlFor="title">Title:</Label>
        <Input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </section>
      <section className="flex flex-col gap-2">
        <Label htmlFor="slug">Slug:</Label>
        <Input
          name="slug"
          type="text"
          value={slugify(title)}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
        />
      </section>
    </section>
  );
};

export default TitleForm;
