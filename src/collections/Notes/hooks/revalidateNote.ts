import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Note } from "@/payload-types";

export const revalidateNote: CollectionAfterChangeHook<Note> = async ({
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
    const path = `/notes/${doc.slug}`;
    const isNewPublish = previousDoc?._status !== "published";

    payload.logger.info(
      `Revalidating note at path: ${path} (${isNewPublish ? "NEW PUBLISH" : "EDIT"})`
    );

    // Revalidate the specific note path
    revalidatePath(path);

    // Update cache tags - selective invalidation based on publish status
    if (isNewPublish) {
      // New publish: full invalidation including feeds for immediate SEO indexing
      revalidateTag("notes", { expire: 0 }); // Immediate invalidation
      revalidateTag(`note-${doc.slug}`, { expire: 0 });
      revalidateTag("homepage", { expire: 0 });
      revalidateTag("sitemap", { expire: 0 });
      revalidateTag("rss", { expire: 0 }); // Invalidate feeds for new content
      revalidatePath("/");
      revalidatePath("/notes");

      payload.logger.info(
        `✅ NEW NOTE published: "${doc.title || doc.slug}" - Full cache invalidation including feeds`
      );
    } else {
      // Edit to published note: use configured cache profiles, skip feed invalidation
      // This prevents every typo fix from waking the database for all feed readers
      revalidateTag("notes", "notes"); // Use notes profile (30min stale, 1hr revalidate)
      revalidateTag(`note-${doc.slug}`, "notes");
      revalidateTag("homepage", "homepage"); // Use homepage profile (30min stale)
      // Skip RSS/sitemap invalidation for edits - feeds will update on next natural refresh

      payload.logger.info(
        `✅ EDITED published note: "${doc.title || doc.slug}" - Cache refreshed (feeds unchanged to reduce DB wake-ups)`
      );
    }
  }

  // If the note was previously published, we need to revalidate the old path
  if (previousDoc?._status === "published" && doc._status !== "published") {
    const oldPath = `/notes/${previousDoc.slug}`;

    payload.logger.info(
      `Updating cache for unpublished note at path: ${oldPath}`
    );

    revalidatePath(oldPath);
    revalidateTag("notes", "notes"); // Use configured profile for gentler invalidation
    revalidateTag(`note-${previousDoc.slug}`, "notes");
    revalidateTag("homepage", "homepage");
    revalidateTag("sitemap", "sitemap");
    revalidateTag("rss", "rss"); // Update feeds with configured profile
    revalidatePath("/");
    revalidatePath("/notes");
  }

  return doc;
};

export const revalidateNoteDelete: CollectionAfterDeleteHook<Note> = async ({
  doc,
  req,
}) => {
  const path = `/notes/${doc?.slug}`;

  req.payload.logger.info(`Revalidating deleted note at path: ${path}`);

  revalidatePath(path);
  revalidateTag("notes", "notes"); // Use configured profile for gentler invalidation
  revalidateTag(`note-${doc?.slug}`, "notes");
  revalidateTag("homepage", "homepage");
  revalidateTag("sitemap", "sitemap");
  revalidateTag("rss", "rss"); // Update feeds with configured profile
  revalidatePath("/");
  revalidatePath("/notes");

  return doc;
};
