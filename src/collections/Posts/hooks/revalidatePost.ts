import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Post } from "@/payload-types";

// Helper: resolve author usernames from the post document
async function getAuthorUsernames(
  req: any,
  authors: Post["authors"] | undefined,
  populatedAuthors?: { username?: string | null }[] | null
): Promise<string[]> {
  const usernames = new Set<string>();

  // Prefer populated authors if available
  if (Array.isArray(populatedAuthors)) {
    for (const a of populatedAuthors) {
      const u = a?.username;
      if (typeof u === "string" && u.trim()) {
        usernames.add(u.trim());
      }
    }
  }

  if (Array.isArray(authors)) {
    for (const a of authors) {
      if (
        a &&
        typeof a === "object" &&
        "username" in a &&
        typeof (a as any).username === "string"
      ) {
        const u = (a as any).username as string;
        if (u?.trim()) {
          usernames.add(u.trim());
        }
      } else if (typeof a === "number" || typeof a === "string") {
        try {
          const user = await req.payload.findByID({
            collection: "lyovsons",
            id: a as any,
          });
          const u = user?.username;
          if (typeof u === "string" && u.trim()) {
            usernames.add(u.trim());
          }
        } catch {
          // ignore lookup failures
        }
      }
    }
  }

  return Array.from(usernames);
}

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
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
    const path = `/posts/${doc.slug}`;
    const isNewPublish = previousDoc?._status !== "published";

    payload.logger.info(
      `Revalidating post at path: ${path} (${isNewPublish ? "NEW PUBLISH" : "EDIT"})`
    );

    // Revalidate the specific post path
    revalidatePath(path);

    // Update cache tags - selective invalidation based on publish status to reduce database wake-ups
    if (isNewPublish) {
      // New publish: full invalidation including feeds for immediate SEO indexing
      revalidateTag("posts", { expire: 0 }); // Immediate invalidation
      revalidateTag(`post-${doc.slug}`, { expire: 0 });
      revalidateTag("homepage", { expire: 0 });
      revalidateTag("sitemap", { expire: 0 });
      revalidateTag("rss", { expire: 0 }); // Invalidate feeds for new content
      revalidatePath("/");
      revalidatePath("/posts");

      payload.logger.info(
        `✅ NEW POST published: "${doc.title}" - Full cache invalidation including feeds`
      );
    } else {
      // Edit to published post: use configured cache profiles, skip feed invalidation
      // This prevents every typo fix from waking the database for all feed readers
      revalidateTag("posts", "posts"); // Use posts profile (30min stale, 1hr revalidate)
      revalidateTag(`post-${doc.slug}`, "posts");
      revalidateTag("homepage", "homepage"); // Use homepage profile (30min stale)
      // Skip RSS/sitemap invalidation for edits - feeds will update on next natural refresh (6-12hr cache)

      payload.logger.info(
        `✅ EDITED published post: "${doc.title}" - Cache refreshed (feeds unchanged to reduce DB wake-ups)`
      );
    }

    // If post belongs to a project, invalidate project cache
    if (doc.project && typeof doc.project === "object") {
      revalidateTag(`project-${doc.project.slug}`, "projects");
      revalidatePath(`/projects/${doc.project.slug}`);
    }

    // Invalidate author pages/tags for all authors on this post
    try {
      const authorUsernames = await getAuthorUsernames(
        req,
        doc.authors as any,
        (doc as any).populatedAuthors
      );
      if (authorUsernames.length) {
        revalidateTag("users", "authors"); // Use authors profile
        for (const username of authorUsernames) {
          revalidateTag(`author-${username}`, "authors");
          revalidatePath(`/${username}`);
        }
        payload.logger.info(
          `Updated author pages for: ${authorUsernames.map((u) => `/${u}`).join(", ")}`
        );
      }
    } catch (e) {
      payload.logger.error(
        `Failed to update author pages for post change: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc?._status === "published" && doc._status !== "published") {
    const oldPath = `/posts/${previousDoc.slug}`;

    payload.logger.info(
      `Updating cache for unpublished post at path: ${oldPath}`
    );

    revalidatePath(oldPath);
    revalidateTag("posts", "posts"); // Use configured profile for gentler invalidation
    revalidateTag(`post-${previousDoc.slug}`, "posts");
    revalidateTag("homepage", "homepage");
    revalidateTag("sitemap", "sitemap");
    revalidateTag("rss", "rss"); // Update feeds with configured profile
    revalidatePath("/");
    revalidatePath("/posts");

    // Also update old project and author pages
    if (previousDoc.project && typeof previousDoc.project === "object") {
      revalidateTag(`project-${previousDoc.project.slug}`, "projects");
      revalidatePath(`/projects/${previousDoc.project.slug}`);
    }

    try {
      const prevAuthorUsernames = await getAuthorUsernames(
        req,
        previousDoc.authors as any,
        (previousDoc as any).populatedAuthors
      );
      if (prevAuthorUsernames.length) {
        revalidateTag("users", "authors");
        for (const username of prevAuthorUsernames) {
          revalidateTag(`author-${username}`, "authors");
          revalidatePath(`/${username}`);
        }
        payload.logger.info(
          `Updated author pages after unpublish: ${prevAuthorUsernames
            .map((u) => `/${u}`)
            .join(", ")}`
        );
      }
    } catch (e) {
      payload.logger.error(
        `Failed to update author pages for previous post state: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req,
}) => {
  const path = `/posts/${doc?.slug}`;

  revalidatePath(path);
  revalidateTag("posts", "posts"); // Use configured profile for gentler invalidation
  revalidateTag(`post-${doc?.slug}`, "posts");
  revalidateTag("homepage", "homepage");
  revalidateTag("sitemap", "sitemap");
  revalidateTag("rss", "rss"); // Update feeds with configured profile
  revalidatePath("/");
  revalidatePath("/posts");

  // If post belonged to a project, invalidate project cache
  if (doc?.project && typeof doc.project === "object") {
    revalidateTag(`project-${doc.project.slug}`, "projects");
    revalidatePath(`/projects/${doc.project.slug}`);
  }

  // Invalidate author pages/tags
  try {
    const authorUsernames = await getAuthorUsernames(
      req as any,
      doc?.authors as any,
      (doc as any)?.populatedAuthors
    );
    if (authorUsernames.length) {
      revalidateTag("users", "authors");
      for (const username of authorUsernames) {
        revalidateTag(`author-${username}`, "authors");
        revalidatePath(`/${username}`);
      }
    }
  } catch {
    // ignore
  }

  return doc;
};
