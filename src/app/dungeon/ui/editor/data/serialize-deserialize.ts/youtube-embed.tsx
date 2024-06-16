"use client";
import { YouTubeEmbed as YouTubeEmbedComponent } from "react-social-media-embed";

export const YouTubeEmbed = async ({ url }: { url: string }) => {
  return (
    <>
      <YouTubeEmbedComponent
        width={"384px"}
        className="w-full max-w-96 mx-auto aspect-video
        "
        url={url}
      />
    </>
  );
};
