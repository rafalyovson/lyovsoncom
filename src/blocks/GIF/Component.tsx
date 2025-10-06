"use client";

import type React from "react";
import { useEffect } from "react";
import RichText from "@/components/RichText";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GIFBlock as GIFBlockType } from "./types";

export const GIFBlock: React.FC<GIFBlockType> = ({ embedCode, caption }) => {
  useEffect(() => {
    // Load Tenor embed script
    const script = document.createElement("script");
    script.src = "https://tenor.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!embedCode?.postId) {
    return null;
  }

  return (
    <Card className="glass-interactive glass-stagger-1 py-0 transition-all duration-300">
      <CardContent className="px-0">
        <div className="glass-media overflow-hidden rounded-lg">
          <div
            className="tenor-gif-embed glass-interactive transition-all duration-300"
            data-aspect-ratio={embedCode.aspectRatio}
            data-postid={embedCode.postId}
            data-share-method="host"
            data-width="100%"
          />
        </div>
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            "glass-section rounded-lg p-2 transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-border-hover)] focus-visible:ring-offset-2",
            "hover:shadow-md"
          )}
        >
          <RichText
            className="glass-text-secondary w-full text-center text-sm italic"
            content={caption}
          />
        </CardFooter>
      )}
    </Card>
  );
};
