import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/data/db";
import { images } from "@/data/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

const ImagePage = async ({ params }: { params: any }) => {
  const { slug } = params;
  const [image] = await db.select().from(images).where(eq(images.slug, slug));
  return (
    <article>
      <Card className="w-full max-w-[600px] mx-auto flex flex-col gap-2 items-center">
        <CardHeader>
          <Image
            src={image.url}
            alt={image.altText!}
            width={400}
            height={400}
          />
        </CardHeader>
        <CardContent>
          <p>{`${image.caption}`}</p>
        </CardContent>
      </Card>
    </article>
  );
};

export default ImagePage;
