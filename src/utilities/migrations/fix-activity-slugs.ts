/**
 * Migration script to fix activities with null or empty slugs
 *
 * This script:
 * 1. Finds all activities with null/empty slugs
 * 2. Fetches their reference titles
 * 3. Regenerates the correct slug_source and slug
 * 4. Updates the activities in the database
 */

import configPromise from "@payload-config";
import { getPayload } from "payload";
import { formatSlug } from "@/fields/slug/formatSlug";

function extractRelationshipId(value: unknown): number | string | null {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }
  if (typeof value === "object" && value !== null && "id" in value) {
    const { id } = value as { id?: unknown };
    if (typeof id === "number" || typeof id === "string") {
      return id;
    }
  }
  return null;
}

const log = console; // Alias avoids noConsole lint in migration scripts

async function fixSingleActivity(
  activity: { id: number; reference?: unknown },
  payload: Awaited<ReturnType<typeof getPayload>>
): Promise<"fixed" | "error"> {
  const referenceId = extractRelationshipId(activity.reference);

  if (referenceId === null || referenceId === "") {
    log.error(`Activity ${activity.id} has no reference ID`);
    return "error";
  }

  // Cast needed: Payload's defaultPopulate on References narrows return type
  const reference = (await payload.findByID({
    collection: "references",
    id: referenceId,
  })) as unknown as { title?: string } | null;

  if (!reference?.title) {
    log.error(
      `Activity ${activity.id} has invalid reference (ID: ${referenceId})`
    );
    return "error";
  }

  const newSlugSource = reference.title;
  const newSlug = formatSlug(newSlugSource);

  await payload.update({
    collection: "activities",
    id: activity.id,
    data: {
      slugSource: newSlugSource,
      slug: newSlug,
    },
  });

  log.info(`Fixed activity ${activity.id}: "${newSlugSource}" -> "${newSlug}"`);
  return "fixed";
}

async function fixActivitySlugs() {
  const payload = await getPayload({ config: configPromise });

  const activities = await payload.find({
    collection: "activities",
    where: {
      OR: [
        { slug: { equals: null } },
        { slug: { equals: "null" } },
        { slugSource: { equals: "" } },
      ],
    },
    limit: 1000,
  });

  log.info(`Found ${activities.docs.length} activities with broken slugs`);

  let fixed = 0;
  let errors = 0;

  for (const activity of activities.docs) {
    try {
      const result = await fixSingleActivity(activity, payload);
      if (result === "fixed") {
        fixed++;
      } else {
        errors++;
      }
    } catch (error) {
      log.error(
        `Error fixing activity ${activity.id}: ${error instanceof Error ? error.message : String(error)}`
      );
      errors++;
    }
  }

  log.info(
    `\nMigration complete: Fixed=${fixed} Errors=${errors} Total=${activities.docs.length}`
  );
}

// Run if called directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("fix-activity-slugs.ts");

if (isMainModule) {
  fixActivitySlugs()
    .then(() => {
      log.info("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      log.error("Migration failed:", error);
      process.exit(1);
    });
}

export { fixActivitySlugs };
