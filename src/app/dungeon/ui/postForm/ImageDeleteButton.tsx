"use client";
import { deleteImage } from "@/app/dungeon/lib/imageDelete";
import { Button } from "@/components/ui/button";
const ImageDeleteButton = ({ img }: { img: string }) => {
  return (
    <Button onClick={() => deleteImage(img)} variant={"destructive"}>
      Test
    </Button>
  );
};

export default ImageDeleteButton;
