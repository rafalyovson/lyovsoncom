import { ImageCard } from '@/app/dungeon/ui/image-card/';
import { db } from '@/data/db';
import { images } from '@/data/schema';
import { eq } from 'drizzle-orm';

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const [image] = await db.select().from(images).where(eq(images.slug, slug));
  return (
    <article>
      <ImageCard image={image} />
    </article>
  );
};

export default Page;
