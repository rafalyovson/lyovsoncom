"use client";

import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utilities/cn";

export const Search: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [value, setValue] = useState(initialQuery);

  const navigate = () => {
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate();
    }
  };

  return (
    <div className={cn(className)}>
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <Label className="sr-only" htmlFor="search">
          Search
        </Label>
        <Input
          autoFocus
          id="search"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          value={value}
        />
        <Button className="rounded-lg" type="submit">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
