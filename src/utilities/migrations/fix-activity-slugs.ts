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

async function fixActivitySlugs() {
  const payload = await getPayload({ config: configPromise });

  // Find all activities with broken slugs
  const activities = await payload.find({
    collection: "activities",
    where: {
      OR: [
        {
          slug: {
            equals: null,
          },
        },
        {
          slug: {
            equals: "null",
          },
        },
        {
          slugSource: {
            equals: "",
          },
        },
      ],
    },
    limit: 1000,
  });

  console.log(`Found ${activities.docs.length} activities with broken slugs`);

  let fixed = 0;
  let errors = 0;

  for (const activity of activities.docs) {
    try {
      // Get reference ID
      const referenceId =
        typeof activity.reference === "number"
          ? activity.reference
          : typeof activity.reference === "string"
            ? activity.reference
            : typeof activity.reference === "object" && activity.reference !== null && "id" in activity.reference
              ? activity.reference.id
              : null;

      if (!referenceId) {
        console.error(`Activity ${activity.id} has no reference ID`);
        errors++;
        continue;
      }

      // Fetch reference
      const reference = await payload.findByID({
        collection: "references",
        id: referenceId,
      });

      if (!reference || !reference.title) {
        console.error(
          `Activity ${activity.id} has invalid reference (ID: ${referenceId})`
        );
        errors++;
        continue;
      }

      // Generate new slug
      const newSlugSource = reference.title;
      const newSlug = formatSlug(newSlugSource);

      // Update activity
      await payload.update({
        collection: "activities",
        id: activity.id,
        data: {
          slugSource: newSlugSource,
          slug: newSlug,
        },
      });

      console.log(
        `Fixed activity ${activity.id}: "${newSlugSource}" -> "${newSlug}"`
      );
      fixed++;
    } catch (error) {
      console.error(
        `Error fixing activity ${activity.id}: ${error instanceof Error ? error.message : String(error)}`
      );
      errors++;
    }
  }

  console.log(`\nMigration complete:`);
  console.log(`  Fixed: ${fixed}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Total: ${activities.docs.length}`);
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("fix-activity-slugs.ts");

if (isMainModule) {
  fixActivitySlugs()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

export { fixActivitySlugs };
