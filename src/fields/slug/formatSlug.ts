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
      const fallbackData = data?.[fallback];

      // Explicitly check for non-empty string (empty string is falsy but we need to handle it)
      if (fallbackData && typeof fallbackData === "string" && fallbackData.length > 0) {
        return formatSlug(fallbackData);
      }
    }

    // Return existing value or undefined (don't return null string)
    return value || undefined;
  };
