import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Media } from "@/components/Media";
import type { Post } from "@/payload-types";

export type GridCardPostProps = {
  post: Post;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  priority?: boolean;
};

export const GridCardPostSearch = ({
  post,
  className,
  loading,
  fetchPriority,
  priority,
}: GridCardPostProps) => {
  const { project, featuredImage, title, slug } = post;

  const postUrl = `/posts/${slug}`;

  return (
    <Link className="group glass-interactive" href={postUrl}>
      <GridCard className={className}>
        {featuredImage && typeof featuredImage !== "string" && (
          <GridCardSection
            className={"col-start-1 col-end-4 row-start-1 row-end-3"}
          >
            <Media
              className="glass-media flex h-full items-center justify-center"
              imgClassName="object-cover h-full"
              pictureClassName="h-full"
              resource={featuredImage}
              {...(loading ? { loading } : {})}
              {...(fetchPriority ? { fetchPriority } : {})}
              {...(priority ? { priority } : {})}
            />
          </GridCardSection>
        )}
        <GridCardSection
          className={
            "col-start-1 col-end-4 row-start-3 row-end-4 flex h-full flex-col justify-center"
          }
        >
          <h2
            className={
              "glass-text text-center font-bold text-xl transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
            }
          >
            {title}
          </h2>
        </GridCardSection>
      </GridCard>
    </Link>
  );
};
