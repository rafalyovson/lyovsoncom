import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Activity } from "@/payload-types";

// Build date slug (MM-DD-YY) from activity date fields
function getDateSlug(doc: Activity): string | null {
  const dateTime = doc.finishedAt || doc.startedAt || doc.publishedAt;
  if (!dateTime) {
    return null;
  }
  const dateObj = new Date(dateTime);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
}

// Invalidate shared activity listing caches
function invalidateActivityListings(immediate: boolean) {
  const profile = immediate ? { expire: 0 } : "activities";
  revalidateTag("activities", profile);
  revalidateTag("homepage", immediate ? { expire: 0 } : "homepage");
  revalidatePath("/");
  revalidatePath("/activities");
}

// Invalidate caches for a specific activity path
function invalidateActivityPath(doc: Activity, immediate: boolean) {
  const dateSlug = getDateSlug(doc);
  if (!(dateSlug && doc.slug)) {
    return;
  }
  revalidatePath(`/activities/${dateSlug}/${doc.slug}`);
  const fullPath = `${dateSlug}/${doc.slug}`;
  const profile = immediate ? { expire: 0 } : "activities";
  revalidateTag(`activity-${fullPath}`, profile);
}

export const revalidateActivity: CollectionAfterChangeHook<Activity> = ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipRevalidation) {
    return doc;
  }

  const { payload } = req;

  if (doc._status === "published") {
    const isNewPublish = previousDoc?._status !== "published";
    payload.logger.info(
      `Revalidating activity: ${doc.id} (${isNewPublish ? "NEW PUBLISH" : "EDIT"})`
    );
    invalidateActivityPath(doc, isNewPublish);
    invalidateActivityListings(isNewPublish);
  }

  // Previously published, now unpublished
  if (previousDoc?._status === "published" && doc._status !== "published") {
    payload.logger.info(`Updating cache for unpublished activity: ${doc.id}`);
    invalidateActivityPath(previousDoc as Activity, false);
    invalidateActivityListings(false);
  }

  return doc;
};

export const revalidateActivityDelete: CollectionAfterDeleteHook<Activity> = ({
  doc,
  req,
}) => {
  req.payload.logger.info(`Revalidating deleted activity: ${doc?.id}`);
  invalidateActivityPath(doc as Activity, false);
  invalidateActivityListings(false);

  return doc;
};
