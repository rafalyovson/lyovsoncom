import {db} from "@/data/db";
import {User, users} from "@/data/schema";
import {eq} from "drizzle-orm";

export async function userSelectByUsername(data: { username: string }): Promise<{
    message: string,
    success: boolean,
    user: User | null
}> {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, data.username));

    if (!user) {
        return {success: false, message: "User not found", user: null};
    }

    return {success: true, message: "Success", user: user};

}