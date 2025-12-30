import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import type { PaginatedDocs } from "payload";
import { getPayload } from "payload";
import type { Activity } from "@/payload-types";

export async function getActivity(slug: string): Promise<Activity | null> {
  "use cache";
  cacheTag("activities");
  cacheTag(`activity-${slug}`);
  cacheLife("activities");

  const payload = await getPayload({ config: configPromise });
  const response = await payload.find({
    collection: "activities",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  });

  return (response.docs[0] as Activity) || null;
}

export async function getLatestActivities(
  limit = 12
): Promise<PaginatedDocs<Activity>> {
  "use cache";
  cacheTag("activities");
  cacheTag("homepage");
  cacheLife("activities");

  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "activities",
    depth: 2,
    limit,
    overrideAccess: true,
    sort: "-publishedAt",
  });

  return {
    ...result,
    docs: result.docs as Activity[],
  };
}

export async function getPaginatedActivities(
  pageNumber: number,
  limit = 12
): Promise<PaginatedDocs<Activity>> {
  "use cache";
  cacheTag("activities");
  cacheTag(`activities-page-${pageNumber}`);
  cacheLife("activities");

  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "activities",
    depth: 2,
    limit,
    page: pageNumber,
    overrideAccess: true,
    sort: "-publishedAt",
  });

  return {
    ...result,
    docs: result.docs as Activity[],
  };
}

export async function getActivityCount() {
  "use cache";
  cacheTag("activities");
  cacheTag("activity-count");
  cacheLife("activities");

  const payload = await getPayload({ config: configPromise });
  return await payload.count({
    collection: "activities",
    overrideAccess: false,
  });
}
