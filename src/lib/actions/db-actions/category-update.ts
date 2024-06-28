import { db } from "@/data/db";
import {
  categories,
  Category,
  categoryInsertSchema,
  NewCategory,
} from "@/data/schema";
import { eq } from "drizzle-orm";

export async function categoryUpdate(
  data: NewCategory
): Promise<{ success: boolean; message: string; category: Category | null }> {
  const parsedData = categoryInsertSchema.safeParse(data);

  if (!parsedData.success) {
    console.log("Validation error", parsedData.error.issues);
    return {
      success: parsedData.success,
      message: "Validation error",
      category: null,
    };
  }

  try {
    await db.update(categories).set(data).where(eq(categories.slug, data.slug));
    const [newCategory] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, data.slug));
    return {
      success: parsedData.success,
      message: "Category updated successfully",
      category: newCategory,
    };
  } catch (error) {
    console.error("Failed to update category:", error);
    return {
      success: false,
      message: "Failed to update category",
      category: null,
    };
  }
}
