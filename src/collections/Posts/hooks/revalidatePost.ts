import { revalidatePath, updateTag } from "next/cache";
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
}) => {
  const { payload } = req;

  if (doc._status === "published") {
    const path = `/posts/${doc.slug}`;

    payload.logger.info(`Revalidating post at path: ${path}`);

    // Revalidate the specific post path
    revalidatePath(path);

    // Update cache tags with immediate refresh for instant visibility
    updateTag("posts");
    updateTag(`post-${doc.slug}`);
    updateTag("homepage"); // Homepage shows latest posts
    updateTag("sitemap");
    updateTag("rss"); // Explicitly invalidate RSS feeds for immediate SEO indexing
    // Belt-and-suspenders: explicitly revalidate key listing paths
    revalidatePath("/");
    revalidatePath("/posts");

    // Log cache invalidation for monitoring
    payload.logger.info(
      `✅ Cache updated for new post: "${doc.title}" - RSS feeds, sitemap, and homepage refreshed immediately`
    );

    // If post belongs to a project, invalidate project cache
    if (doc.project && typeof doc.project === "object") {
      updateTag(`project-${doc.project.slug}`);
      // Also revalidate the project landing page path if present
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
        updateTag("users");
        for (const username of authorUsernames) {
          updateTag(`author-${username}`);
          // Revalidate well-known author paths (e.g., /rafa, /jess)
          revalidatePath(`/${username}`);
        }
        payload.logger.info(
          `Updated author pages for: ${authorUsernames.map((u) => `/${u}`).join(", ")}`
        );
      }
    } catch (e) {
      payload.logger.error(
        "Failed to update author pages for post change",
        e
      );
    }
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc?._status === "published" && doc._status !== "published") {
    const oldPath = `/posts/${previousDoc.slug}`;

    payload.logger.info(`Updating cache for unpublished post at path: ${oldPath}`);

    revalidatePath(oldPath);
    updateTag("posts");
    updateTag(`post-${previousDoc.slug}`);
    updateTag("homepage");
    updateTag("sitemap");
    // Also revalidate main listing paths
    revalidatePath("/");
    revalidatePath("/posts");

    // Also update old project and author pages
    if (previousDoc.project && typeof previousDoc.project === "object") {
      updateTag(`project-${previousDoc.project.slug}`);
      revalidatePath(`/projects/${previousDoc.project.slug}`);
    }

    try {
      const prevAuthorUsernames = await getAuthorUsernames(
        req,
        previousDoc.authors as any,
        (previousDoc as any).populatedAuthors
      );
      if (prevAuthorUsernames.length) {
        updateTag("users");
        for (const username of prevAuthorUsernames) {
          updateTag(`author-${username}`);
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
        "Failed to update author pages for previous post state",
        e
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
  updateTag("posts");
  updateTag(`post-${doc?.slug}`);
  updateTag("homepage"); // Homepage shows latest posts
  updateTag("sitemap");
  // Also revalidate main listing paths
  revalidatePath("/");
  revalidatePath("/posts");

  // If post belonged to a project, invalidate project cache
  if (doc?.project && typeof doc.project === "object") {
    updateTag(`project-${doc.project.slug}`);
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
      updateTag("users");
      for (const username of authorUsernames) {
        updateTag(`author-${username}`);
        revalidatePath(`/${username}`);
      }
    }
  } catch {
    // ignore
  }

  return doc;
};
