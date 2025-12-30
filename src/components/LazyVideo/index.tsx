"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LazyVideoProps = {
  mp4Src?: string;
  webmSrc?: string;
  poster?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  className?: string;
  alt?: string;
};

/**
 * LazyVideo Component - Intersection Observer Lazy Loading
 *
 * Performance Optimizations:
 * - Uses Intersection Observer API for lazy loading
 * - Loads video sources only when scrolling near (300px margin)
 * - Supports MP4 and WebM formats with automatic fallback
 * - Autoplay + loop + muted for GIF-like behavior
 * - Poster image placeholder while loading
 *
 * Use Case:
 * - Optimized replacement for Tenor GIF embeds
 * - Converts GIF → MP4/WebM for 80-85% size reduction
 */
export const LazyVideo = ({
  mp4Src,
  webmSrc,
  poster,
  aspectRatio = "1:1",
  className,
  alt = "Video content",
}: LazyVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px", // Start loading when 300px away from viewport
      }
    );

    observer.observe(videoElement);

    return () => observer.disconnect();
  }, []);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "4:3":
        return "aspect-4/3";
      case "16:9":
        return "aspect-video";
      case "1:1":
        return "aspect-square";
      default:
        return "aspect-square";
    }
  };

  return (
    <video
      aria-label={alt}
      autoPlay
      className={cn(
        "glass-media w-full rounded-lg",
        getAspectRatioClass(),
        className
      )}
      loop
      muted
      playsInline
      poster={poster}
      ref={videoRef}
    >
      {isLoaded && (
        <>
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          {mp4Src && <source src={mp4Src} type="video/mp4" />}
        </>
      )}
    </video>
  );
};
