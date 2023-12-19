// UploadForm.js
"use client";
import useFileUpload from "@/app/lib/useFileUpload";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Suspense, useRef, useState } from "react";
import { deleteImage } from "../../lib/actions";
import Button from "../../ui/Button";

export default function UploadForm({ value }) {
  const inputFileRef = useRef(null);
  const { blob, loading, error, uploadFile } = useFileUpload();
  const [newImage, setNewImage] = useState(value || null);

  const handleFileUpload = (e) => {
    e?.preventDefault();
    const file = inputFileRef.current.files[0];
    uploadFile(file);
  };

  if (newImage) {
    return (
      <>
        <input
          name="imageUrl"
          type="url"
          required
          className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
        />

        <div className="relative cursor-pointer">
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black bg-opacity-50 opacity-0 hover:opacity-100"
            onClick={() => {
              deleteImage(newImage);
              setNewImage(null);
            }}
          >
            <Button>X</Button>
          </div>
          <Image src={newImage} alt={newImage} width="400" height="300" />
        </div>
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
          {!blob && (
            <label className="p-2 text-center border cursor-pointer border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-blue-400 ">
              <FontAwesomeIcon icon={faUpload} /> Upload Image
              <input
                onChange={handleFileUpload}
                name="file"
                ref={inputFileRef}
                type="file"
                required
                style={{ display: "none" }}
              />
            </label>
          )}

          {blob && (
            <Suspense fallback={<div>Loading...</div>}>
              <input
                name="imageUrl"
                type="url"
                required
                className="p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-beige"
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
