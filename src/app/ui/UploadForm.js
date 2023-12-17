// UploadForm.js
"use client";
import useFileUpload from "@/app/lib/useFileUpload";
import Image from "next/image";
import { Suspense, useRef } from "react";

export default function UploadForm() {
  const inputFileRef = useRef(null);
  const { blob, loading, error, uploadFile } = useFileUpload();

  const handleFileUpload = (e) => {
    e?.preventDefault();
    const file = inputFileRef.current.files[0];
    uploadFile(file);
  };

  // rest of the component

  return (
    <>
      {error && <div>Error: {error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!blob && (
            <input
              onChange={handleFileUpload}
              name="file"
              ref={inputFileRef}
              type="file"
              required
            />
          )}

          {blob && (
            <Suspense fallback={<div>Loading...</div>}>
              <input
                name="imageUrl"
                type="url"
                required
                className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={blob.url}
              />

              <Image
                onClick={() => navigator.clipboard.writeText(blob.url)}
                src={blob.url}
                alt={blob.name}
                width="400"
                height="300"
              />
            </Suspense>
          )}
        </>
      )}
    </>
  );
}
