import configPromise from "@payload-config";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { Suspense } from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import {
  GridCardActivityFull,
  GridCardNoteFull,
  GridCardPostFull,
  SkeletonCard,
} from "@/components/grid";
import type { Activity, Note, Post } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";

type Args = {
  searchParams: Promise<{
    q: string;
  }>;
};

type SearchAPIResponse = {
  results: Array<{
    collection: string;
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
      return (
        <>
          <h1 className="sr-only">{headingText}</h1>
          <CollectionArchive posts={[]} />
        </>
      );
    }

    searchResults = await response.json();
  } catch (_error) {
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

  // Group results by collection
  const postsResults = searchResults.results.filter(
    (r) => r.collection === "posts"
  );
  const notesResults = searchResults.results.filter(
    (r) => r.collection === "notes"
  );
  const activitiesResults = searchResults.results.filter(
    (r) => r.collection === "activities"
  );

  const payload = await getPayload({ config: configPromise });

  // Fetch posts
  const postsResponse =
    postsResults.length > 0
      ? await payload.find({
          collection: "posts",
          where: {
            id: {
              in: postsResults.map((r) => r.id),
            },
          },
          depth: 2,
          limit: postsResults.length,
        })
      : { docs: [] };

  // Fetch notes
  const notesResponse =
    notesResults.length > 0
      ? await payload.find({
          collection: "notes",
          where: {
            id: {
              in: notesResults.map((r) => r.id),
            },
          },
          depth: 1,
          limit: notesResults.length,
        })
      : { docs: [] };

  // Fetch activities
  const activitiesResponse =
    activitiesResults.length > 0
      ? await payload.find({
          collection: "activities",
          where: {
            id: {
              in: activitiesResults.map((r) => r.id),
            },
          },
          // Include nested reference image and participant profile fields for cards.
          depth: 2,
          limit: activitiesResults.length,
          // Lyovson read access is private, so relation population needs overrideAccess.
          overrideAccess: true,
        })
      : { docs: [] };

  // Create maps for sorting
  const postsMap = new Map(postsResponse.docs.map((post) => [post.id, post]));
  const notesMap = new Map(notesResponse.docs.map((note) => [note.id, note]));
  const activitiesMap = new Map(
    activitiesResponse.docs.map((activity) => [activity.id, activity])
  );

  // Sort results to match search order
  const sortedItems = searchResults.results
    .map((result) => {
      if (result.collection === "posts") {
        return { type: "post" as const, data: postsMap.get(result.id) };
      }
      if (result.collection === "notes") {
        return { type: "note" as const, data: notesMap.get(result.id) };
      }
      if (result.collection === "activities") {
        return {
          type: "activity" as const,
          data: activitiesMap.get(result.id),
        };
      }
      return null;
    })
    .filter(
      (
        item
      ): item is
        | { type: "post"; data: Post }
        | { type: "note"; data: Note }
        | { type: "activity"; data: Activity } =>
        item !== null && item.data !== undefined
    );

  return (
    <>
      <h1 className="sr-only">{headingText}</h1>
      {sortedItems.map((item) => {
        if (item.type === "post") {
          return <GridCardPostFull key={item.data.slug} post={item.data} />;
        }
        if (item.type === "note") {
          return <GridCardNoteFull key={item.data.slug} note={item.data} />;
        }
        if (item.type === "activity") {
          return (
            <GridCardActivityFull activity={item.data} key={item.data.slug} />
          );
        }
        return null;
      })}
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
    metadataBase: new URL(getServerSideURL()),
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
