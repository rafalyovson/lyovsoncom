import { db } from "@/data/db";
import { categories, Category } from "@/data/schema";
import { eq } from "drizzle-orm";

export async function categorySelectAll(): Promise<{
  success: boolean;
  categories: Category[] | null;
  message: string;
}> {
  try {
    const allCategories = await db.select().from(categories);
    return { success: true, categories: allCategories, message: "Success" };
  } catch (error) {
    console.error("Error selecting all categories:", error);
    return { success: false, categories: null, message: "Error" };
  }
}

export async function categorySelectById(data: { id: string }): Promise<{
  success: boolean;
  category: Category | null;
  message: string;
}> {
  try {
    const [theCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, data.id));
    return { success: true, category: theCategory, message: "Success" };
  } catch (error) {
    console.error("Error selecting category by id:", error);
    return { success: false, category: null, message: "Error" };
  }
}

export async function categorySelectBySlug(data: { slug: string }): Promise<{
  success: boolean;
  category: Category | null;
  message: string;
}> {
  try {
    const [theCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.slug));

    if (theCategory.length === 0) {
      return { success: false, category: null, message: "Category not found" };
    } else {
      return { success: true, category: theCategory, message: "Success" };
    }
  } catch (error) {
    console.error("Error selecting category by slug:", error);
    return { success: false, category: null, message: "Error" };
  }
}
