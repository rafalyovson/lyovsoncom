import { cacheLife, cacheTag } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { GridCardEmptyState, SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { getActivityPath } from "@/utilities/activity-path";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import type { LyovsonMixedFeedItem } from "@/utilities/get-lyovson-feed";
import { getLyovsonFeed } from "@/utilities/get-lyovson-feed";
import { getServerSideURL } from "@/utilities/getURL";
import { LyovsonFeedItems } from "../../_components/lyovson-feed-items";
import {
  getValidPageNumber,
  LYOVSON_ITEMS_PER_PAGE,
  MAX_INDEXED_PAGE,
} from "../../_utilities/constants";

interface Args {
  params: Promise<{
    lyovson: string;
    pageNumber: string;
  }>;
}

function getLyovsonFeedItemUrl(item: LyovsonMixedFeedItem): string | null {
  if (item.type === "post" && item.data.slug) {
    return `${getServerSideURL()}/posts/${item.data.slug}`;
  }

  if (item.type === "note" && item.data.slug) {
    return `${getServerSideURL()}/notes/${item.data.slug}`;
  }

  if (item.type === "activity") {
    const activityPath = getActivityPath(item.data);
    if (activityPath) {
      return `${getServerSideURL()}${activityPath}`;
    }
  }

  return null;
}

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { lyovson: username, pageNumber } = await paramsPromise;
  const sanitizedPageNumber = getValidPageNumber(pageNumber);

  cacheTag("posts");
  cacheTag("notes");
  cacheTag("activities");
  cacheTag("lyovsons");
  cacheTag(`lyovson-${username}`);
  cacheTag(`lyovson-${username}-all-page-${pageNumber}`);
  cacheLife("posts");
  cacheLife("notes");
  cacheLife("activities");

  if (!sanitizedPageNumber) {
    notFound();
  }

  if (sanitizedPageNumber === 1) {
    redirect(`/${username}`);
  }

  const response = await getLyovsonFeed({
    username,
    filter: "all",
    page: sanitizedPageNumber,
    limit: LYOVSON_ITEMS_PER_PAGE,
  });

  if (!response) {
    return notFound();
  }

  if (sanitizedPageNumber > response.totalPages) {
    return notFound();
  }

  const { user, items, totalItems, totalPages } = response;

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${user.name} - Feed Page ${sanitizedPageNumber}`,
    description: `Chronological feed page ${sanitizedPageNumber} for ${user.name}.`,
    url: `${getServerSideURL()}/${username}/page/${sanitizedPageNumber}`,
    itemCount: totalItems,
    items: items
      .map((item) => {
        const itemUrl = getLyovsonFeedItemUrl(item);
        return itemUrl ? { url: itemUrl } : null;
      })
      .filter((item): item is { url: string } => Boolean(item)),
  });

  return (
    <>
      <h1 className="sr-only">
        {user.name} feed page {sanitizedPageNumber}
      </h1>

      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        {items.length > 0 ? (
          <LyovsonFeedItems items={items} />
        ) : (
          <GridCardEmptyState
            description={`No items found on page ${sanitizedPageNumber} for ${user.name}.`}
            title="No Results"
          />
        )}
      </Suspense>

      {totalPages > 1 && (
        <Pagination
          basePath={`/${username}/page`}
          firstPagePath={`/${username}`}
          page={sanitizedPageNumber}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { lyovson: username, pageNumber } = await paramsPromise;
  const sanitizedPageNumber = getValidPageNumber(pageNumber);

  if (!sanitizedPageNumber || sanitizedPageNumber < 2) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Not Found | Lyóvson.com",
      description: "The requested page could not be found.",
    };
  }

  const response = await getLyovsonFeed({
    username,
    filter: "all",
    page: sanitizedPageNumber,
    limit: LYOVSON_ITEMS_PER_PAGE,
  });

  if (!response || sanitizedPageNumber > response.totalPages) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Not Found | Lyóvson.com",
      description: "The requested page could not be found.",
    };
  }

  const name = response.user.name || username;
  const title = `${name} - Page ${sanitizedPageNumber} | Lyóvson.com`;
  const description = `Feed page ${sanitizedPageNumber} for ${name}.`;

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    alternates: {
      canonical: `/${username}/page/${sanitizedPageNumber}`,
      ...(sanitizedPageNumber > 1 && {
        prev:
          sanitizedPageNumber === 2
            ? `/${username}`
            : `/${username}/page/${sanitizedPageNumber - 1}`,
      }),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${username}/page/${sanitizedPageNumber}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
      site: "@lyovson",
    },
    robots: {
      index: sanitizedPageNumber <= MAX_INDEXED_PAGE,
      follow: true,
      noarchive: sanitizedPageNumber > 1,
    },
  };
}
