interface ActivityPathInput {
  finishedAt?: string | null;
  publishedAt?: string | null;
  slug?: string | null;
  startedAt?: string | null;
}

export const UNKNOWN_ACTIVITY_DATE_SLUG = "unknown";

export function getActivityDateValue(
  activity: ActivityPathInput
): string | null {
  return (
    activity.finishedAt || activity.startedAt || activity.publishedAt || null
  );
}

export function getActivityDateSlug(activity: ActivityPathInput): string {
  const dateValue = getActivityDateValue(activity);

  if (!dateValue) {
    return UNKNOWN_ACTIVITY_DATE_SLUG;
  }

  const dateObject = new Date(dateValue);
  if (Number.isNaN(dateObject.getTime())) {
    return UNKNOWN_ACTIVITY_DATE_SLUG;
  }

  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const year = String(dateObject.getFullYear()).slice(-2);

  return `${month}-${day}-${year}`;
}

export function getActivityPath(activity: ActivityPathInput): string | null {
  if (!activity.slug) {
    return null;
  }

  return `/activities/${getActivityDateSlug(activity)}/${activity.slug}`;
}

export function getActivityFullPath(
  activity: ActivityPathInput
): string | null {
  if (!activity.slug) {
    return null;
  }

  return `${getActivityDateSlug(activity)}/${activity.slug}`;
}
