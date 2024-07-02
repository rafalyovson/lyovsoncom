"use server";

import {db} from "@/data/db";
import {categories} from "@/data/schema";
import {eq} from "drizzle-orm";
import {createInsertSchema} from "drizzle-zod";
import {revalidatePath} from "next/cache";
import {z} from "zod";

export const categoryCreate = async (
    _prevState: { message: string },
    formData: FormData
) => {
    const data = {
        name: formData.get("name"),
        slug: formData.get("slug"),
    };

    const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.name, data.name));

    if (existingCategory.length > 0) {
        return {message: "Category already exists"};
    }

    const schema = createInsertSchema(categories, {
        name: z.string().min(1, {message: "Name is required"}),
        slug: z.string().min(1, {message: "Slug is required"}),
    });

    const parsedData = schema.safeParse(data);

    if (parsedData.success) {
        await db.insert(categories).values(data);
        revalidatePath("/dungeon/categories");
        return {message: "success"};
    } else {
        return {message: "error"};
    }
};

