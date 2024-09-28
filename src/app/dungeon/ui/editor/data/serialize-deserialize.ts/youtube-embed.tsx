'use client';

import { YouTubeEmbed as YouTubeEmbedComponent } from 'react-social-media-embed';

export const YouTubeEmbed = ({ url }: { url: string }) => {
  return (
    <article className="flex justify-center items-center w-full">
      <YouTubeEmbedComponent
        className="w-full max-w-full aspect-video mx-auto"
        url={url}
      />
    </article>
  );
};
