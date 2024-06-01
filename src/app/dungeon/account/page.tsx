import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/data/db";
import { SocialNetwork, socialNetworks } from "@/data/schema";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { eq } from "drizzle-orm";
import Image from "next/image";
import SocialTable from "./SocialTable";

const page = async () => {
  const user = await getCurrentUser();

  const socials: SocialNetwork[] = await db
    .select()
    .from(socialNetworks)
    .where(eq(socialNetworks.userId, user.id!));

  return (
    <main className="flex gap-8 items-center flex-wrap p-8">
      <header>
        <Card>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Image
              src={user.image || ""}
              alt={user.name!}
              width={300}
              height={300}
            />
          </CardContent>
        </Card>
      </header>
      <aside>
        <SocialTable socials={socials} />
      </aside>
    </main>
  );
};

export default page;
