import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";

import { ActivitiesArchive } from "@/components/ActivitiesArchive";
import { SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLatestActivities } from "@/utilities/get-activity";
import { getServerSideURL } from "@/utilities/getURL";

const ACTIVITIES_PER_PAGE = 12;

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
    items: docs.map((activity) => ({
      url: `${getServerSideURL()}/activities/${activity.slug}`,
    })),
  });

  return (
    <>
      <h1 className="sr-only">All Activities & Consumption</h1>

      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        <ActivitiesArchive activities={docs} />
      </Suspense>

      {totalPages > 1 && page && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </>
  );
}

export const metadata: Metadata = {
  title: "All Activities & Consumption | Lyóvson.com",
  description:
    "Browse reading, watching, listening, and playing activities logged by the Lyóvson family.",
  openGraph: {
    title: "All Activities & Consumption | Lyóvson.com",
    description:
      "Browse reading, watching, listening, and playing activities logged by the Lyóvson family.",
    url: `${getServerSideURL()}/activities`,
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




