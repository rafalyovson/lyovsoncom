import { prisma } from "../lib/db.js";

export const allPosts = await prisma.post.findMany();
