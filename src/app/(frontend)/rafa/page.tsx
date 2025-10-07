import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { GridCardRafa } from "@/components/grid/card/user";
import RichText from "@/components/RichText";
import { getAuthorPosts } from "@/utilities/get-author-posts";

export default async function Page() {
  "use cache";

  // Add cache tags for Rafa's posts
  cacheTag("posts");
  cacheTag("users");
  cacheTag("author-rafa");
  cacheLife("authors");

  const response = await getAuthorPosts("rafa");

  if (!response) {
    return notFound();
  }

  const { user } = response;

  return (
    <>
      <GridCardRafa
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
  title: "Rafa Lyovson - Posts & Programming | Lyovson.com",
  description:
    "Posts, articles, and programming insights by Rafa Lyovson. Explore thoughts on technology, software development, and research projects.",
  keywords: [
    "Rafa Lyovson",
    "programming",
    "software development",
    "technology",
    "research",
    "articles",
    "blog posts",
    "coding",
  ],
  alternates: {
    canonical: "/rafa",
  },
  openGraph: {
    title: "Rafa Lyovson - Posts & Programming",
    description:
      "Posts, articles, and programming insights by Rafa Lyovson on technology, software development, and research.",
    type: "profile",
    url: "/rafa",
    // Profile information for structured data
    firstName: "Rafa",
    lastName: "Lyovson",
    username: "rafa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafa Lyovson - Posts & Programming",
    description:
      "Posts, articles, and programming insights by Rafa Lyovson on technology and software development.",
    creator: "@lyovson",
    site: "@lyovson",
  },
  other: {
    // Hint for Person structured data
    "profile:first_name": "Rafa",
    "profile:last_name": "Lyovson",
    "profile:username": "rafa",
    "article:author": "Rafa Lyovson",
  },
};
