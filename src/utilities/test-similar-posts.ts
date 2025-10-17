import configPromise from "@payload-config";
import { getPayload } from "payload";
import { getSimilarPosts } from "./get-similar-posts";

async function testSimilarPosts() {
  const payload = await getPayload({ config: configPromise });

  // Get a test post
  const testPost = await payload.find({
    collection: "posts",
    where: {
      _status: { equals: "published" },
      embedding_vector: { exists: true },
    },
    limit: 1,
  });

  if (testPost.docs.length === 0) {
    console.log("❌ No published posts with embeddings found");
    process.exit(1);
  }

  const post = testPost.docs[0];
  console.log(`\n🧪 Testing similarity search for post: "${post.title}" (ID: ${post.id})\n`);

  try {
    const similarPosts = await getSimilarPosts(post.id, 3);

    console.log(`✅ Found ${similarPosts.length} similar posts:\n`);

    for (const [index, similar] of similarPosts.entries()) {
      console.log(`${index + 1}. [${similar.id}] ${similar.title}`);
    }

    console.log("\n🎉 Test successful! getSimilarPosts() is working correctly.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

testSimilarPosts();
