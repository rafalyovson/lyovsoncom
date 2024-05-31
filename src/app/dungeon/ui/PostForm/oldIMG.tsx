"use client";

import { deleteImage } from "@/app/dungeon/lib/imageDelete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRef, useState } from "react";

const ImageForm = ({ url }: { url?: string }) => {
  const [image, setImage] = useState(url);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: any) => {
    e?.preventDefault();
    const newImage = inputFileRef.current?.files?.[0];
    try {
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
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <Label htmlFor="file">Image:</Label>
      {!image && (
        <Input
          onChange={handleFileUpload}
          name="file"
          ref={inputFileRef}
          type="file"
          required
        />
      )}
      {image && (
        <section className="flex flex-col gap-8">
          <section className="relative cursor-pointer ">
            <section className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
              <Button
                variant={"destructive"}
                onClick={() => {
                  deleteImage(image);
                  setImage("");
                }}
              >
                X
              </Button>
            </section>
            <Image
              src={image}
              alt={image}
              width="400"
              height="300"
              className=" object-cover "
            />
          </section>
        </section>
      )}
    </section>
  );
};

export default ImageForm;
