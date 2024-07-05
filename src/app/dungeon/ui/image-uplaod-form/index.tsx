import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageType } from '@/data/schema';
import { Dispatch } from 'react';
import { ImageCard } from '../image-card';
import { ImageForm } from '../image-form';

export const ImageUploadForm = ({
  isOpen,
  setIsOpen,
  image,
  setImage,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setId?: Dispatch<string>;
  image?: ImageType | null;
  setImage?: any;
}) => {
  return (
    <section className="flex flex-col gap-2  ">
      <Label htmlFor="imageId">Image</Label>
      <Input
        className="hidden"
        name="imageId"
        type="text"
        placeholder="Featured Image Id"
        value={image?.id}
      />
      {image && <ImageCard image={image} />}
      <Button
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
        variant={'secondary'}
      >
        {image ? 'Update Image' : 'Upload Image'}
      </Button>
      <ResponsiveModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Upload Image"
        desc="Upload the featured image of the post."
      >
        <ImageForm setImage={setImage} setIsOpen={setIsOpen} />
      </ResponsiveModal>
    </section>
  );
};
