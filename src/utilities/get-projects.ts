import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import type { Project } from "@/payload-types";

export async function getProjects(): Promise<Project[] | null> {
  "use cache";
  cacheTag("projects");
  cacheLife("projects");

  const payload = await getPayload({ config: configPromise });

  const projects = await payload.find({
    collection: "projects",
    limit: 100,
    sort: "createdAt:desc",
  });

  if (!projects?.docs?.[0]) {
    return null;
  }

  return projects.docs as Project[];
}
