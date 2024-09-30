'use client';

import { ImageCard } from '../image-card';
import { Image } from '@/data/schema';
import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@/components/ui/button';

type ImageSelectProps = {
  images: Image[];
  setImage: Dispatch<SetStateAction<Image | null>>;
  setIsOpen: Dispatch<boolean>;
};

export function ImageSelect(props: ImageSelectProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  return (
    <section className="flex flex-col gap-2  ">
      <h1>Images</h1>
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-xl mx-auto place-items-center">
        {props.images.map((image) => (
          <article
            className={`flex flex-col gap-2 ${selectedImage?.id === image.id && 'border-2 border-primary'}`}
            key={image.id}
            onClick={() => setSelectedImage(image)}
          >
            <ImageCard image={image} key={image.id} />
          </article>
        ))}
      </main>
      <Button
        variant={'default'}
        onClick={() => {
          props.setImage(selectedImage);
          props.setIsOpen(false);
        }}
      >
        Select Image
      </Button>
    </section>
  );
}
