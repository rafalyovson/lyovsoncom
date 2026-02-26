import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { GridCardEmptyState, SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLyovsonFeed } from "@/utilities/get-lyovson-feed";
import { getServerSideURL } from "@/utilities/getURL";
import { LyovsonFeedItems } from "../_components/lyovson-feed-items";
import { LYOVSON_ITEMS_PER_PAGE } from "../_utilities/constants";

interface PageProps {
  params: Promise<{ lyovson: string }>;
}

export default async function Page({ params }: PageProps) {
  "use cache";

  const { lyovson: username } = await params;

  cacheTag("notes");
  cacheTag("lyovsons");
  cacheTag(`lyovson-${username}`);
  cacheTag(`lyovson-${username}-notes`);
  cacheLife("notes");

  const response = await getLyovsonFeed({
    username,
    filter: "notes",
    page: 1,
    limit: LYOVSON_ITEMS_PER_PAGE,
  });

  if (!response) {
    return notFound();
  }

  const { user, items, totalItems, totalPages } = response;

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${user.name} - Notes`,
    description: `Published notes by ${user.name}.`,
    url: `${getServerSideURL()}/${username}/notes`,
    itemCount: totalItems,
    items: items
      .map((item) => {
        if (item.type === "note" && item.data.slug) {
          return { url: `${getServerSideURL()}/notes/${item.data.slug}` };
        }
        return null;
      })
      .filter((item): item is { url: string } => Boolean(item)),
  });

  return (
    <>
      <h1 className="sr-only">{user.name} notes</h1>
      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        {items.length > 0 ? (
          <LyovsonFeedItems items={items} />
        ) : (
          <GridCardEmptyState
            description={`No public notes found for ${user.name} yet.`}
            title="No Notes Yet"
          />
        )}
      </Suspense>

      {totalPages > 1 && (
        <Pagination
          basePath={`/${username}/notes/page`}
          firstPagePath={`/${username}/notes`}
          page={1}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lyovson: username } = await params;

  const response = await getLyovsonFeed({
    username,
    filter: "notes",
    page: 1,
    limit: LYOVSON_ITEMS_PER_PAGE,
  });

  if (!response) {
    return {
      metadataBase: new URL(getServerSideURL()),
      title: "Not Found | Lyóvson.com",
      description: "The requested page could not be found.",
    };
  }

  const name = response.user.name || username;
  const title = `${name} Notes | Lyóvson.com`;
  const description = `Browse public notes by ${name}.`;

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    alternates: {
      canonical: `/${username}/notes`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${username}/notes`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@lyovson",
      creator: "@lyovson",
    },
  };
}
