import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import type { Project } from "@/payload-types";

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheTag("projects");
  cacheTag(`project-${slug}`);
  cacheLife("static"); // Projects change less frequently

  const payload = await getPayload({ config: configPromise });
  const response = await payload.find({
    collection: "projects",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  return (response.docs[0] as Project) || null;
}

export async function getCachedProjectBySlug(
  slug: string
): Promise<Project | null> {
  "use cache";
  cacheTag("projects");
  cacheTag(`project-${slug}`);
  cacheLife("static"); // Projects change less frequently

  const payload = await getPayload({ config: configPromise });
  const response = await payload.find({
    collection: "projects",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  return (response.docs[0] as Project) || null;
}
