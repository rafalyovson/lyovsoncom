import {db} from "@/data/db";
import {categories, categoryPost, images, posts, tagPost, tags, users} from "@/data/schema";
import {eq} from "drizzle-orm";

export async function postGetFull(): Promise<any> {
    return db
        .select({
            post: posts,
            author: users,
            featuredImage: images,
            category: categories,
            tag: tags,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(images, eq(posts.featuredImageId, images.id)) // Link the featured image
        .leftJoin(categoryPost, eq(posts.id, categoryPost.postId))
        .leftJoin(categories, eq(categoryPost.categoryId, categories.id))
        .leftJoin(tagPost, eq(posts.id, tagPost.postId))
        .leftJoin(tags, eq(tagPost.tagId, tags.id));
}