import { ImageCard } from '@/app/dungeon/ui/image-card/';
import { db } from '@/data/db';
import { images } from '@/data/schema';
import { eq } from 'drizzle-orm';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { slug } = await params;
  const [image] = await db.select().from(images).where(eq(images.slug, slug));
  return (
    <article>
      <ImageCard image={image} />
    </article>
  );
};

export default Page;
