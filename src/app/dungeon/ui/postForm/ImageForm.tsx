"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

const ImageForm = () => {
  const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <Label htmlFor="file">Image:</Label>

      <Input
        name="file"
        type="file"
        required
        onChange={handleFileChange}
        accept="image/*"
      />

      {imagePreview && (
        <div className="mt-2">
          <Image
            src={imagePreview}
            alt="Image preview"
            width={400}
            height={400}
            className="max-w-full h-auto"
          />
        </div>
      )}
    </section>
  );
};

export default ImageForm;
