import { db } from "@/data/db";
import { images } from "@/data/schema";
import Image from "next/image";

const Page = async () => {
  const allImages = await db.select().from(images);

  return (
    <>
      <h1>Images</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-[1200px] gap-4 place-items-center ">
        {allImages.map((image: any) => (
          <section className="flex flex-col gap-2" key={image.url}>
            <Image
              className="aspect-square object-cover rounded-lg shadow-lg"
              src={image.url}
              alt={image.alt}
              width={200}
              height={200}
            />

            <p>{`[${image.type}] - ${image.name}`}</p>
          </section>
        ))}
      </section>
    </>
  );
};

export default Page;
