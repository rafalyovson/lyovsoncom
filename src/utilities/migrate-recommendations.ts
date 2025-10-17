import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getSimilarPosts } from "./get-similar-posts";

async function migrateRecommendations() {
  const payload = await getPayload({ config: configPromise });

  console.log("🔍 Finding all published posts with embeddings...");

  const posts = await payload.find({
    collection: "posts",
    where: {
      _status: { equals: "published" },
      embedding_vector: { exists: true },
    },
    limit: 1000,
  });

  console.log(`📊 Found ${posts.docs.length} posts to process\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const post of posts.docs) {
    try {
      if (!post.embedding_vector) {
        console.log(`⏭️  Skipping post ${post.id}: No embedding`);
        skipCount++;
        continue;
      }

      console.log(`🔄 Processing: ${post.title}`);

      const similar = await getSimilarPosts(post.id, 3);
      const ids = similar.map((p) => p.id);

      await payload.update({
        collection: "posts",
        id: post.id,
        data: { recommended_post_ids: ids },
        overrideAccess: true,
        context: {
          skipRecommendationCompute: true, // Prevent recommendation hook from running
          skipRevalidation: true, // Prevent revalidation hook from running
        },
      });

      console.log(
        `✅ Updated post ${post.id}: Found ${ids.length} recommendations [${ids.join(", ")}]\n`
      );
      successCount++;
    } catch (error) {
      console.error(`❌ Error processing post ${post.id}:`, error);
      errorCount++;
    }
  }

  console.log("\n📈 Migration Summary:");
  console.log(`✅ Successfully updated: ${successCount} posts`);
  console.log(`⏭️  Skipped: ${skipCount} posts`);
  console.log(`❌ Errors: ${errorCount} posts`);
}

migrateRecommendations()
  .then(() => {
    console.log("\n🎉 Migration complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  });
