import { prisma } from "../../lib/prisma.js";

export const allPosts = await prisma.post.findMany();
