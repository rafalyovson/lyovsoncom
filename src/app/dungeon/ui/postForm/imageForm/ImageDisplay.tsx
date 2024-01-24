"use client";
// ImageDisplay.js

import { deleteImage } from "@/app/dungeon/lib/postActions";
import Button from "@/app/ui/Button";
import Image from "next/image";

export default function ImageDisplay({
  src,
  onDelete,
}: {
  src: string;
  onDelete: () => void;
}) {
  return (
    <div className="relative cursor-pointer">
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black bg-opacity-50 opacity-0 hover:opacity-100"
        onClick={onDelete}
      >
        <Button onClick={() => deleteImage(src)}>X</Button>
      </div>
      <Image src={src} alt={src} width="400" height="300" />
    </div>
  );
}
