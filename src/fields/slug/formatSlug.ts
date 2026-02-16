import type { FieldHook } from "payload";

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === "string" && value.length > 0) {
      return formatSlug(value);
    }

    if (operation === "create" || !data?.slug) {
      // Check incoming data first, then fall back to originalDoc for partial updates
      // and async hook ordering scenarios where data may not yet carry the fallback field
      const fallbackData =
        data?.[fallback] ||
        (originalDoc &&
        typeof originalDoc === "object" &&
        fallback in originalDoc &&
        typeof originalDoc[fallback] === "string"
          ? originalDoc[fallback]
          : undefined);

      if (
        fallbackData &&
        typeof fallbackData === "string" &&
        fallbackData.length > 0
      ) {
        return formatSlug(fallbackData);
      }
    }

    // Return existing value or undefined (don't return null string)
    return value || undefined;
  };
