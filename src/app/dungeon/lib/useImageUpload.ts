"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useState } from "react";
import { uploadImage } from "./imageActions";

export default function useImageUpload() {
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (image: File) => {
    setLoading(true);
    setError(null);

    try {
      const newBlob = await uploadImage(image);
      setBlob(newBlob);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { blob, loading, error, setBlob, uploadFile };
}
