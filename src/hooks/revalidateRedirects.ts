import { updateTag } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

export const revalidateRedirects: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info("Updating cache for redirects");

  updateTag("redirects");

  return doc;
};
