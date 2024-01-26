"use client";
import { deleteImage } from "@/app/dungeon/lib/imageActions";
import useImageUpload from "@/app/dungeon/lib/useImageUpload";
import ImageDisplay from "@/app/dungeon/ui/postForm/imageForm/ImageDisplay";
import ImageUploadForm from "@/app/dungeon/ui/postForm/imageForm/ImageUploadForm";
import { Suspense, useState } from "react";

const ImageInput = ({
  value,
  className,
}: {
  value: string;
  className: string;
}) => (
  <input
    name="imageUrl"
    type="url"
    title="Image URL"
    required
    className={className}
    value={value}
  />
);

const DeleteImage = ({
  src,
  setBlob,
  setNewImage,
}: {
  src: string;
  setBlob: Function;
  setNewImage: Function;
}) => {
  const handleDelete = () => {
    deleteImage(src);
    setBlob({ url: "" });
    setNewImage("");
  };

  return <ImageDisplay src={src} onDelete={handleDelete} />;
};

export default function UploadForm({ value }: { value?: string }) {
  const { blob, loading, error, setBlob, uploadFile } = useImageUpload();
  const [newImage, setNewImage] = useState(value || "");

  if (newImage) {
    return (
      <>
        <ImageInput
          value={value || ""}
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <DeleteImage
          src={newImage}
          setBlob={setBlob}
          setNewImage={setNewImage}
        />
      </>
    );
  }

  return (
    <>
      {error && <div>Error: {error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!blob && <ImageUploadForm onFileSelected={uploadFile} />}
          {blob && (
            <Suspense fallback={<div>Loading...</div>}>
              <ImageInput
                value={blob.url}
                className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-beige"
              />
              <DeleteImage
                src={blob.url}
                setBlob={setBlob}
                setNewImage={setNewImage}
              />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}
