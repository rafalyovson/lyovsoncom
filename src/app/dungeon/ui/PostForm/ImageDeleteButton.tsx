"use client";
import { deleteImage } from "@/app/dungeon/lib/imageDelete";
import { Button } from "@/components/ui/button";
const ImageDeleteButton = ({ image }: { image: string }) => {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        deleteImage(image);
      }}
      variant={"destructive"}
    >
      X
    </Button>
  );
};

export default ImageDeleteButton;
