import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Activity } from "@/payload-types";

// Helper to build activity path from finishedAt/startedAt/publishedAt date and slug
function getActivityPath(doc: Activity): string | null {
  const dateTime = doc.finishedAt || doc.startedAt || doc.publishedAt;
  if (!dateTime || !doc.slug) {
    return null;
  }
  const dateObj = new Date(dateTime);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  const dateSlug = `${month}-${day}-${year}`;
  return `/activities/${dateSlug}/${doc.slug}`;
}

// Helper to get the full path for cache tag (date/slug format)
function getActivityFullPath(doc: Activity): string | null {
  const dateTime = doc.finishedAt || doc.startedAt || doc.publishedAt;
  if (!dateTime || !doc.slug) {
    return null;
  }
  const dateObj = new Date(dateTime);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  const dateSlug = `${month}-${day}-${year}`;
  return `${dateSlug}/${doc.slug}`;
}

export const revalidateActivity: CollectionAfterChangeHook<Activity> = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  // Skip revalidation during migration or other system operations
  if (context?.skipRevalidation) {
    return doc;
  }

  const { payload } = req;

  if (doc._status === "published") {
    const path = getActivityPath(doc);
    const fullPath = getActivityFullPath(doc);
    const isNewPublish = previousDoc?._status !== "published";

    payload.logger.info(
      `Revalidating activity: ${doc.id} (${isNewPublish ? "NEW PUBLISH" : "EDIT"})`
    );

    if (path && fullPath) {
      // Revalidate the specific activity path
      revalidatePath(path);

      // Update cache tags - selective invalidation based on publish status
      if (isNewPublish) {
        // New publish: full invalidation for immediate visibility
        revalidateTag("activities", { expire: 0 }); // Immediate invalidation
        revalidateTag(`activity-${fullPath}`, { expire: 0 });
        revalidateTag("homepage", { expire: 0 });
        revalidatePath("/");
        revalidatePath("/activities");

        payload.logger.info(
          `✅ NEW ACTIVITY published: ${doc.id} - Full cache invalidation`
        );
      } else {
        // Edit to published activity: use configured cache profiles
        revalidateTag("activities", "activities"); // Use activities profile (30min stale, 1hr revalidate)
        revalidateTag(`activity-${fullPath}`, "activities");
        revalidateTag("homepage", "homepage"); // Use homepage profile (30min stale)

        payload.logger.info(
          `✅ EDITED published activity: ${doc.id} - Cache refreshed`
        );
      }
    }
  }

  // If the activity was previously published, we need to revalidate the old path
  if (previousDoc?._status === "published" && doc._status !== "published") {
    const oldPath = getActivityPath(previousDoc as Activity);
    const oldFullPath = getActivityFullPath(previousDoc as Activity);

    payload.logger.info(
      `Updating cache for unpublished activity: ${doc.id}`
    );

    if (oldPath && oldFullPath) {
      revalidatePath(oldPath);
      revalidateTag(`activity-${oldFullPath}`, "activities");
    }
    revalidateTag("activities", "activities"); // Use configured profile for gentler invalidation
    revalidateTag("homepage", "homepage");
    revalidatePath("/");
    revalidatePath("/activities");
  }

  return doc;
};

export const revalidateActivityDelete: CollectionAfterDeleteHook<Activity> =
  async ({ doc, req }) => {
    const path = getActivityPath(doc as Activity);
    const fullPath = getActivityFullPath(doc as Activity);

    req.payload.logger.info(`Revalidating deleted activity: ${doc?.id}`);

    if (path && fullPath) {
      revalidatePath(path);
      revalidateTag(`activity-${fullPath}`, "activities");
    }
    revalidateTag("activities", "activities"); // Use configured profile for gentler invalidation
    revalidateTag("homepage", "homepage");
    revalidatePath("/");
    revalidatePath("/activities");

    return doc;
  };
