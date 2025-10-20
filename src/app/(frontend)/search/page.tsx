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

  const headingText = query?.trim()
    ? `Search Results for "${query.trim()}"`
    : "Search";

  // If no query, return empty results
  if (!query?.trim()) {
    return (
      <>
        <h1 className="sr-only">{headingText}</h1>
        <CollectionArchive posts={[]} />
      </>
    );
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
      return (
        <>
          <h1 className="sr-only">{headingText}</h1>
          <CollectionArchive posts={[]} />
        </>
      );
    }

    searchResults = await response.json();
  } catch (error) {
    console.error("[Search Page] Failed to fetch search results:", error);
    return (
      <>
        <h1 className="sr-only">{headingText}</h1>
        <CollectionArchive posts={[]} />
      </>
    );
  }

  // If no results, return empty
  if (!searchResults.results || searchResults.results.length === 0) {
    return (
      <>
        <h1 className="sr-only">{headingText}</h1>
        <CollectionArchive posts={[]} />
      </>
    );
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

  return (
    <>
      <h1 className="sr-only">{headingText}</h1>
      <CollectionArchive posts={sortedPosts} />
    </>
  );
}

export async function generateMetadata({
  searchParams: searchParamsPromise,
}: Args): Promise<Metadata> {
  const { q: query } = await searchParamsPromise;

  const title = query
    ? `Search results for "${query}" | Lyóvson.com`
    : "Search | Lyóvson.com";

  const description = query
    ? `Find posts, articles, and content related to "${query}" on Lyóvson.com`
    : "Search for posts, articles, and content on Lyóvson.com";

  return {
    title,
    description,
    alternates: {
      canonical: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
    },
    openGraph: {
      siteName: "Lyóvson.com",
      title,
      description,
      type: "website",
      url: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@lyovson",
      site: "@lyovson",
      images: [
        {
          url: "/og-image.png",
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
    },
    robots: {
      index: !query, // Don't index search result pages, only the main search page
      follow: true,
    },
  };
}
