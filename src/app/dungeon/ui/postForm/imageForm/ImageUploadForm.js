"use client";

// ImageUploadForm.js
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

export default function ImageUploadForm({ onFileSelected }) {
  const inputFileRef = useRef(null);

  const handleFileUpload = (e) => {
    e?.preventDefault();
    const file = inputFileRef.current.files[0];
    onFileSelected(file);
  };

  return (
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
  );
}
