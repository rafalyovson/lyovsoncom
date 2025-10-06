"use client";

import type React from "react";
import { useEffect } from "react";
import RichText from "@/components/RichText";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { XPostBlock as XPostBlockType } from "@/payload-types";

export const XPostBlock: React.FC<XPostBlockType> = ({ postId, caption }) => {
  useEffect(() => {
    // Load Twitter widgets script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!postId) {
    return null;
  }

  return (
    <Card className="glass-interactive glass-stagger-2 transition-all duration-300">
      <CardContent className="flex justify-center pt-6">
        <div className="w-full max-w-lg">
          <blockquote
            className="twitter-tweet glass-interactive transition-all duration-300"
            data-conversation="none"
            data-theme="light"
          >
            <a
              className="glass-text"
              href={`https://twitter.com/x/status/${postId}`}
            >
              View this post on X
            </a>
          </blockquote>
        </div>
      </CardContent>

      {caption && (
        <CardFooter
          className={cn(
            "glass-section m-4 rounded-lg p-2 transition-all duration-300",
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
