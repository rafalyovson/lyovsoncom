import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { GridCardEmptyState, SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { getActivityPath } from "@/utilities/activity-path";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLyovsonFeed } from "@/utilities/get-lyovson-feed";
import { getServerSideURL } from "@/utilities/getURL";
import { LyovsonFeedItems } from "../_components/lyovson-feed-items";
import { LYOVSON_ITEMS_PER_PAGE } from "../_utilities/constants";
import {
  buildLyovsonMetadata,
  buildLyovsonNotFoundMetadata,
} from "../_utilities/metadata";

interface PageProps {
  params: Promise<{ lyovson: string }>;
}

export default async function Page({ params }: PageProps) {
  "use cache";

  const { lyovson: username } = await params;

  cacheTag("activities");
  cacheTag("lyovsons");
  cacheTag(`lyovson-${username}`);
  cacheTag(`lyovson-${username}-activities`);
  cacheLife("activities");

  const response = await getLyovsonFeed({
    username,
    filter: "activities",
    page: 1,
    limit: LYOVSON_ITEMS_PER_PAGE,
  });

  if (!response) {
    return notFound();
  }

  const { user, items, totalItems, totalPages } = response;

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${user.name} - Activities`,
    description: `Activities associated with ${user.name}.`,
    url: `${getServerSideURL()}/${username}/activities`,
    itemCount: totalItems,
    items: items
      .map((item) => {
        if (item.type !== "activity") {
          return null;
        }

        const activityPath = getActivityPath(item.data);
        if (!activityPath) {
          return null;
        }

        return { url: `${getServerSideURL()}${activityPath}` };
      })
      .filter((item): item is { url: string } => Boolean(item)),
  });

  return (
    <>
      <h1 className="sr-only">{user.name} activities</h1>
      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        {items.length > 0 ? (
          <LyovsonFeedItems items={items} />
        ) : (
          <GridCardEmptyState
            description={`No public activities found for ${user.name} yet.`}
            title="No Activities Yet"
          />
        )}
      </Suspense>

      {totalPages > 1 && (
        <Pagination
          basePath={`/${username}/activities/page`}
          firstPagePath={`/${username}/activities`}
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
    filter: "activities",
    page: 1,
    limit: LYOVSON_ITEMS_PER_PAGE,
  });

  if (!response) {
    return buildLyovsonNotFoundMetadata();
  }

  const name = response.user.name || username;
  const title = `${name} Activities`;
  const description = `Browse activities associated with ${name}.`;

  return buildLyovsonMetadata({
    title,
    description,
    canonicalPath: `/${username}/activities`,
  });
}
