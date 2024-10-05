import { ResponsiveModal } from '@/components/responsive-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageType } from '@/data/schema';
import { Dispatch, SetStateAction } from 'react';
import { ImageCard } from '../image-card';
import { ImageForm } from '../image-form';
import { ImageSelect } from '@/app/dungeon/ui/image-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ImageUploadFormProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setId?: Dispatch<string>;
  image: ImageType | null;
  setImage: Dispatch<SetStateAction<ImageType | null>>;
  group?: string;
};

export const ImageUploadForm = ({
  isOpen,
  setIsOpen,
  image,
  setImage,
  group,
}: ImageUploadFormProps) => {
  return (
    <section className="flex flex-col gap-2">
      <Label htmlFor="imageId">Image</Label>
      <Input
        className="hidden"
        name="imageId"
        type="text"
        placeholder="Featured Image Id"
        value={image?.id || ''}
        readOnly
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
        {image ? 'Change Image' : 'Add Image'}
      </Button>
      <ResponsiveModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Upload Image"
        desc="Upload the featured image of the post."
      >
        <Tabs defaultValue="upload">
          <TabsList className={''}>
            <TabsTrigger value="select">Select Image</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>
          <TabsContent value="select" className={`border  rounded-md p-2`}>
            <ImageSelect setImage={setImage} setIsOpen={setIsOpen} />
          </TabsContent>
          <TabsContent value="upload" className={`border  rounded-md p-2`}>
            <ImageForm
              setImage={setImage}
              group={group}
              setIsOpen={setIsOpen}
            />
          </TabsContent>
        </Tabs>
      </ResponsiveModal>
    </section>
  );
};
