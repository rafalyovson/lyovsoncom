import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/data/db";
import { users } from "@/data/schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: any }) => {
  const { username } = params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (!user) {
    redirect("/dungeon/users");
  }

  const userUpdate = async (formData: FormData) => {
    "use server";
    const schema = createInsertSchema(users, {});
    const data = Object.fromEntries(formData);
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      console.log("Validation error", parsedData.error.issues);
      return;
    }
    await db.update(users).set(data).where(eq(users.username, username));
    redirect("/dungeon/users/" + username);
  };

  return (
    <article className="flex flex-col w-full max-w-screen-lg gap-4 p-4 mx-auto my-4 rounded-lg shadow-lg">
      <h1>{user.name}</h1>
      <form action={userUpdate} method="post">
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            defaultValue={user.name!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="name">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            defaultValue={user.email!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="bio">Bio</Label>
          <Textarea name="bio" placeholder="Bio" defaultValue={user.bio!} />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="image">Image</Label>
          <Input
            name="image"
            type="url"
            placeholder="Image"
            defaultValue={user.image!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="xLink">X</Label>
          <Input
            name="xLink"
            type="url"
            placeholder="X"
            defaultValue={user.xLink!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="redditLink">Reddit</Label>
          <Input
            name="redditLink"
            type="url"
            placeholder="Reddit"
            defaultValue={user.redditLink!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="githubLink">GitHub</Label>
          <Input
            name="githubLink"
            type="url"
            placeholder="GitHub"
            defaultValue={user.githubLink!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="linkedInLink">LinkedIn</Label>
          <Input
            name="linkedInLink"
            type="url"
            placeholder="Linkedin"
            defaultValue={user.linkedInLink!}
          />
        </section>
        <section className="flex flex-col gap-2 p-4">
          <Label htmlFor="youtubeLink">YouTube</Label>
          <Input
            name="youtubeLink"
            type="url"
            placeholder="Youtube"
            defaultValue={user.youtubeLink!}
          />
        </section>
        <Button type="submit">Save</Button>
      </form>
    </article>
  );
};

export default Page;
