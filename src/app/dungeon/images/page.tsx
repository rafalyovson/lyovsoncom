import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/data/db';
import { imageGroups } from '@/data/image-groups';
import { Image as ImageType, images } from '@/data/schema';
import { capitalize } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '../ui/page-header';

const ImageGrid = ({ images }: { images: ImageType[] }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-[1200px] gap-4 place-items-center ">
      {images.map((image: ImageType) => (
        <section className="flex flex-col gap-2" key={image.url}>
          <Link href={`/dungeon/images/${image.slug}`}>
            <Card>
              <CardHeader>
                <Image
                  className="aspect-square object-cover rounded-lg shadow-lg"
                  src={image.url}
                  alt={image.altText!}
                  width={200}
                  height={200}
                />
              </CardHeader>
              <CardContent>
                <p>{`${image.caption}`}</p>
              </CardContent>
            </Card>
          </Link>
        </section>
      ))}
    </section>
  );
};

const Page = async () => {
  const allImages: ImageType[] = await db.select().from(images);

  return (
    <>
      <PageHeader title="Images" link="/dungeon/images/create" />
      <Tabs className="max-w-[600px] mx-auto " defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Images</TabsTrigger>
          {imageGroups.map((group: string) => (
            <TabsTrigger key={group} value={group}>
              {`${capitalize(group)} Images`}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <ImageGrid images={allImages} />
        </TabsContent>
        {imageGroups.map((group: string) => (
          <TabsContent value={group} key={group}>
            <ImageGrid
              images={allImages.filter(
                (image: ImageType) => image.group === group,
              )}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Page;
