"use client";
import { XEmbed as XEmbedComponent } from "react-social-media-embed";

export const XEmbed = async ({ url }: { url: string }) => {
  return (
    <>
      <XEmbedComponent className="w-full max-w-96 mx-auto" url={url} />
    </>
  );
};
