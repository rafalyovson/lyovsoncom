import { ImageCard } from '@/components/dungeon/image-card';
import { Image as ImageType } from '@/data/schema';
import { Dispatch } from 'react';
import { Action } from '@/components/dungeon/image-select/image-select-types';

type ImageGridType = {
  dispatch: Dispatch<Action>;
  images: ImageType[];
  selectedImage?: ImageType;
};

export function ImageGrid({ dispatch, images, selectedImage }: ImageGridType) {
  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-full mx-auto">
      {images.map((image: ImageType) => (
        <article
          key={image.id}
          className={`cursor-pointer flex flex-col gap-2 border rounded-lg overflow-hidden ${
            selectedImage?.id === image.id ? 'border-primary shadow-md' : ''
          }`}
          style={{ width: '150px', height: '150px' }}
          onClick={() =>
            dispatch({ type: 'SET_SELECTED_IMAGE', payload: image })
          }
        >
          <ImageCard image={image} />
        </article>
      ))}
    </main>
  );
}
