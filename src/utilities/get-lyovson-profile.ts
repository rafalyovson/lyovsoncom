import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import type { Lyovson } from "@/payload-types";

export async function getLyovsonProfile(
  username: string
): Promise<Lyovson | null> {
  "use cache";
  cacheTag("lyovsons");
  cacheTag(`lyovson-${username}`);
  cacheLife("authors");

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "lyovsons",
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
    overrideAccess: true,
  });

  return (result.docs[0] as Lyovson) || null;
}
