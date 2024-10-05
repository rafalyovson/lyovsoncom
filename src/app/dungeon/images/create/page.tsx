import { ImageForm } from '../../ui/image-form';

const ImageCreate = () => {
  return (
    <article className="max-w-[600px] mx-auto">
      <h1 className="text-2xl text-center">New Image</h1>
      <ImageForm />
    </article>
  );
};

export default ImageCreate;
