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
}) => {
  const { payload } = req;

  if (doc._status === "published") {
    const path = `/posts/${doc.slug}`;

    payload.logger.info(`Revalidating post at path: ${path}`);

    // Revalidate the specific post path
    revalidatePath(path);

    // Revalidate post-related cache tags
    revalidateTag("posts");
    revalidateTag(`post-${doc.slug}`);
    revalidateTag("homepage"); // Homepage shows latest posts
    revalidateTag("sitemap");
    revalidateTag("rss"); // Explicitly invalidate RSS feeds for immediate SEO indexing
    // Belt-and-suspenders: explicitly revalidate key listing paths
    revalidatePath("/");
    revalidatePath("/posts");

    // Log cache invalidation for monitoring
    payload.logger.info(
      `✅ Cache invalidated for new post: "${doc.title}" - RSS feeds, sitemap, and homepage updated immediately`
    );

    // If post belongs to a project, invalidate project cache
    if (doc.project && typeof doc.project === "object") {
      revalidateTag(`project-${doc.project.slug}`);
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
        revalidateTag("users");
        for (const username of authorUsernames) {
          revalidateTag(`author-${username}`);
          // Revalidate well-known author paths (e.g., /rafa, /jess)
          revalidatePath(`/${username}`);
        }
        payload.logger.info(
          `Revalidated author pages for: ${authorUsernames.map((u) => `/${u}`).join(", ")}`
        );
      }
    } catch (e) {
      payload.logger.error(
        "Failed to revalidate author pages for post change",
        e
      );
    }
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc?._status === "published" && doc._status !== "published") {
    const oldPath = `/posts/${previousDoc.slug}`;

    payload.logger.info(`Revalidating old post at path: ${oldPath}`);

    revalidatePath(oldPath);
    revalidateTag("posts");
    revalidateTag(`post-${previousDoc.slug}`);
    revalidateTag("homepage");
    revalidateTag("sitemap");
    // Also revalidate main listing paths
    revalidatePath("/");
    revalidatePath("/posts");

    // Also revalidate old project and author pages
    if (previousDoc.project && typeof previousDoc.project === "object") {
      revalidateTag(`project-${previousDoc.project.slug}`);
      revalidatePath(`/projects/${previousDoc.project.slug}`);
    }

    try {
      const prevAuthorUsernames = await getAuthorUsernames(
        req,
        previousDoc.authors as any,
        (previousDoc as any).populatedAuthors
      );
      if (prevAuthorUsernames.length) {
        revalidateTag("users");
        for (const username of prevAuthorUsernames) {
          revalidateTag(`author-${username}`);
          revalidatePath(`/${username}`);
        }
        payload.logger.info(
          `Revalidated author pages after unpublish: ${prevAuthorUsernames
            .map((u) => `/${u}`)
            .join(", ")}`
        );
      }
    } catch (e) {
      payload.logger.error(
        "Failed to revalidate author pages for previous post state",
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
  revalidateTag("posts");
  revalidateTag(`post-${doc?.slug}`);
  revalidateTag("homepage"); // Homepage shows latest posts
  revalidateTag("sitemap");
  // Also revalidate main listing paths
  revalidatePath("/");
  revalidatePath("/posts");

  // If post belonged to a project, invalidate project cache
  if (doc?.project && typeof doc.project === "object") {
    revalidateTag(`project-${doc.project.slug}`);
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
      revalidateTag("users");
      for (const username of authorUsernames) {
        revalidateTag(`author-${username}`);
        revalidatePath(`/${username}`);
      }
    }
  } catch {
    // ignore
  }

  return doc;
};
