"use client";

import { deleteImage } from "@/app/dungeon/lib/imageDelete";
import Button from "@/app/ui/Button";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState } from "react";

const ImageForm = ({ url }: { url?: string }) => {
  const [image, setImage] = useState(url);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: any) => {
    e?.preventDefault();
    const newImage = inputFileRef.current?.files?.[0];
    const response = await fetch(
      `/api/image/upload?filename=${newImage?.name}`,
      {
        method: "POST",
        body: newImage,
      }
    );

    const { url } = await response.json();
    setImage(url);
    return url;
  };

  if (image) {
    return (
      <>
        <h2>Image: {image}</h2>
        <input
          name="imageUrl"
          type="url"
          title="Image URL"
          required
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={image}
        />

        <div className="relative cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
            <Button
              onClick={() => {
                deleteImage(image);
                setImage("");
              }}
            >
              X
            </Button>
          </div>
          <Image src={image} alt={image} width="400" height="300" />
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Image: {image}</h2>
      <label className="p-2 text-center border cursor-pointer border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400 ">
        <FontAwesomeIcon icon={faUpload} /> Upload Image
        <input
          onChange={handleFileUpload}
          name="file"
          ref={inputFileRef}
          type="file"
          required
          className="hidden"
        />
      </label>
    </>
  );
};

export default ImageForm;
