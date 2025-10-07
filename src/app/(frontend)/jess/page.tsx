import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { GridCardJess } from "@/components/grid/card/user";
import RichText from "@/components/RichText";
import { getAuthorPosts } from "@/utilities/get-author-posts";

export default async function Page() {
  "use cache";

  // Add cache tags for Jess's posts
  cacheTag("posts");
  cacheTag("users");
  cacheTag("author-jess");
  cacheLife("authors");

  const response = await getAuthorPosts("jess");

  if (!response) {
    return notFound();
  }

  const { user } = response;

  return (
    <>
      <GridCardJess
        className={
          "g2:col-start-2 g3:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-start-1 g2:row-end-2 g4:self-start"
        }
        user={user}
      />
      {user?.bio && (
        <article className="glass-card glass-interactive g2:col-start-2 g2:col-end-3 g3:col-end-4 g2:row-auto g2:row-start-2 g3:w-[816px] w-[400px] rounded-lg p-6">
          <div className="prose prose-lg glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none">
            <RichText
              className="h-full"
              content={user.bio}
              enableGutter={false}
              enableProse={true}
            />
          </div>
        </article>
      )}
    </>
  );
}

export const metadata: Metadata = {
  title: "Jess Lyovson - Posts & Writing | Lyovson.com",
  description:
    "Posts, articles, and writing by Jess Lyovson. Explore thoughts on design, philosophy, technology, and creative projects.",
  keywords: [
    "Jess Lyovson",
    "writing",
    "design",
    "philosophy",
    "creativity",
    "articles",
    "blog posts",
  ],
  alternates: {
    canonical: "/jess",
  },
  openGraph: {
    title: "Jess Lyovson - Posts & Writing",
    description:
      "Posts, articles, and writing by Jess Lyovson on design, philosophy, technology, and creative projects.",
    type: "profile",
    url: "/jess",
    // Profile information for structured data
    firstName: "Jess",
    lastName: "Lyovson",
    username: "jess",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jess Lyovson - Posts & Writing",
    description:
      "Posts, articles, and writing by Jess Lyovson on design, philosophy, and technology.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  other: {
    // Hint for Person structured data
    "profile:first_name": "Jess",
    "profile:last_name": "Lyovson",
    "profile:username": "jess",
    "article:author": "Jess Lyovson",
  },
};
