import type React from "react";
import { GridCardPostFull } from "@/components/grid";
import type { Post } from "@/payload-types";

export interface Props {
  posts: Post[];
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props;

  return (
    <>
      {posts?.map((result, index) => {
        if (typeof result === "object" && result !== null) {
          return (
            <GridCardPostFull
              key={result.slug}
              post={result}
              {...(index === 0 && {
                priority: true,
              })}
            />
          );
        }

        return null;
      })}
    </>
  );
};
