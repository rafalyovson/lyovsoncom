import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { SkeletonCard } from "@/components/grid";
import type { Post } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";

type Args = {
  searchParams: Promise<{
    q: string;
  }>;
};

type SearchAPIResponse = {
  results: Array<{
    id: number;
    title: string;
    slug: string;
    description: string;
    featured_image_id: number | null;
    created_at: string;
    updated_at: string;
    semantic_rank: number | null;
    fts_rank: number | null;
    fuzzy_rank: number | null;
    combined_score: number;
  }>;
  query: string;
  count: number;
};

export default function SuspendedSearchPage({
  searchParams: searchParamsPromise,
}: Args) {
  return (
    <Suspense fallback={<SkeletonCard />}>
      <SearchPage searchParams={searchParamsPromise} />
    </Suspense>
  );
}

async function SearchPage({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise;

  // If no query, return empty results
  if (!query?.trim()) {
    return <CollectionArchive posts={[]} />;
  }

  // Call hybrid search API endpoint
  // In development, always use localhost to avoid calling production API
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : getServerSideURL() || "http://localhost:3000";

  const searchUrl = new URL("/api/search", baseUrl);
  searchUrl.searchParams.set("q", query.trim());
  searchUrl.searchParams.set("limit", "12");

  let searchResults: SearchAPIResponse;
  try {
    const response = await fetch(searchUrl.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(
        `[Search Page] API error: ${response.status} ${response.statusText}`
      );
      return <CollectionArchive posts={[]} />;
    }

    searchResults = await response.json();
  } catch (error) {
    console.error("[Search Page] Failed to fetch search results:", error);
    return <CollectionArchive posts={[]} />;
  }

  // If no results, return empty
  if (!searchResults.results || searchResults.results.length === 0) {
    return <CollectionArchive posts={[]} />;
  }

  // Extract post IDs from search results (ordered by combined_score)
  const postIds = searchResults.results.map((result) => result.id);

  // Fetch full post objects with populated relations (for featured images)
  const payload = await getPayload({ config: configPromise });
  const postsResponse = await payload.find({
    collection: "posts",
    where: {
      id: {
        in: postIds,
      },
    },
    depth: 1, // Populate featuredImage relation
    limit: postIds.length,
  });

  if (!postsResponse?.docs) {
    return notFound();
  }

  // Sort posts to match search result order (by combined_score from API)
  const postsMap = new Map(postsResponse.docs.map((post) => [post.id, post]));
  const sortedPosts = postIds
    .map((id) => postsMap.get(id))
    .filter((post): post is Post => post !== undefined);

  return <CollectionArchive posts={sortedPosts} />;
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { q: query } = await searchParamsPromise;

  const title = query
    ? `Search results for "${query}" | Lyovson.com`
    : "Search | Lyovson.com";

  const description = query
    ? `Find posts, articles, and content related to "${query}" on Lyovson.com`
    : "Search for posts, articles, and content on Lyovson.com";

  return {
    title,
    description,
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: !query, // Don't index search result pages, only the main search page
      follow: true,
    },
  };
}
