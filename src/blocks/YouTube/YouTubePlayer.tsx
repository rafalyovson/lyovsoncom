"use client";

import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const getAspectRatioClass = (ratio: string) => {
  switch (ratio) {
    case "4:3":
      return "aspect-4/3";
    case "1:1":
      return "aspect-square";
    default:
      return "aspect-video"; // 16:9
  }
};

const PlayButton = () => (
  <div className="group/play absolute inset-0 z-20 flex items-center justify-center">
    <div className="relative">
      <div className="glass-badge glass-interactive group-hover/play:glass-bg-hover flex h-20 w-20 items-center justify-center rounded-full border border-glass-border shadow-lg backdrop-blur-md transition-all duration-300 group-hover/play:scale-110">
        <div className="ml-1 h-0 w-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[18px] border-l-glass-text transition-colors duration-300 group-hover/play:border-l-glass-text-secondary" />
      </div>
      {/* Glow effect */}
      <div className="glass-glow absolute inset-0 h-20 w-20 rounded-full opacity-0 transition-opacity duration-300 group-hover/play:opacity-100" />
    </div>
  </div>
);

type YouTubePlayerProps = {
  videoId: string;
  aspectRatio?: string;
};

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  aspectRatio = "16:9",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      className={cn(
        "glass-media relative w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300",
        getAspectRatioClass(aspectRatio || "16/9")
      )}
    >
      {isLoaded ? (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
        />
      ) : (
        <button
          aria-label="Play video"
          className="group relative block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-glass-border-hover focus-visible:ring-offset-2"
          onClick={() => setIsLoaded(true)}
          type="button"
        >
          {/* Glass overlay that appears on hover */}
          <div className="glass-bg absolute inset-0 z-10 opacity-0 transition-all duration-300 group-hover:opacity-30" />

          {/* Thumbnail image */}
          <div className="absolute inset-0">
            <Image
              alt="Video thumbnail"
              className="object-cover"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              src={thumbnailUrl}
            />
          </div>

          {/* Play button */}
          <PlayButton />
        </button>
      )}
    </div>
  );
};
