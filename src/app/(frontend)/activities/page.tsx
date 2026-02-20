import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { ActivitiesArchive } from "@/components/ActivitiesArchive";
import { SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { getActivityPath } from "@/utilities/activity-path";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLatestActivities } from "@/utilities/get-activity";
import { getServerSideURL } from "@/utilities/getURL";

const ACTIVITIES_PER_PAGE = 25;

export default async function Page() {
  "use cache";

  cacheTag("activities");
  cacheTag("activities-page");
  cacheLife("activities");

  const response = await getLatestActivities(ACTIVITIES_PER_PAGE);

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page, totalDocs } = response;

  const collectionPageSchema = generateCollectionPageSchema({
    name: "Activities & Consumption",
    description:
      "Browse reading, watching, listening, and playing activities logged by the Lyóvson family.",
    url: `${getServerSideURL()}/activities`,
    itemCount: totalDocs,
    items: docs
      .map((activity) => {
        const activityPath = getActivityPath(activity);
        if (!activityPath) {
          return null;
        }

        return {
          url: `${getServerSideURL()}${activityPath}`,
        };
      })
      .filter((item): item is { url: string } => Boolean(item)),
  });

  return (
    <>
      <h1 className="sr-only">All Activities & Consumption</h1>

      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        <ActivitiesArchive activities={docs} />
      </Suspense>

      {totalPages > 1 && page && (
        <Pagination
          basePath="/activities/page"
          firstPagePath="/activities"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: "All Activities & Consumption | Lyóvson.com",
  description:
    "Browse reading, watching, listening, and playing activities logged by the Lyóvson family.",
  alternates: {
    canonical: "/activities",
  },
  openGraph: {
    title: "All Activities & Consumption | Lyóvson.com",
    description:
      "Browse reading, watching, listening, and playing activities logged by the Lyóvson family.",
    url: "/activities",
    siteName: "Lyóvson.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Activities & Consumption | Lyóvson.com",
    description:
      "Browse reading, watching, listening, and playing activities logged by the Lyóvson family.",
  },
};
