import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Activity } from "@/payload-types";
import {
  getActivityFullPath,
  getActivityPath,
} from "@/utilities/activity-path";

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
  const activityPath = getActivityPath(doc);
  const fullPath = getActivityFullPath(doc);

  if (!(activityPath && fullPath)) {
    return;
  }

  revalidatePath(activityPath);
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
