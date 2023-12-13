"use client";

import { useState } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const create = () => {};

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col border-dark border dark:border-light p-10  shadow-md space-y-6 w-96">
        <h1 className="text-2xl font-bold text-center">New Post</h1>
        <form action={create} className="flex flex-col space-y-4">
          <label className="flex flex-col space-y-2">
            <span className="text-lg font-medium">Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-2 border border-dark dark:border-light bg-light dark:bg-dark  focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <label className="flex flex-col space-y-2">
            <span className="text-lg font-medium">Content:</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="p-2 h-32 border border-dark dark:border-light bg-light dark:bg-dark  focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 border border-beige text-white  "
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
