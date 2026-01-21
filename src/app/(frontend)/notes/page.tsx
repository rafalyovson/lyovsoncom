import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { SkeletonGrid } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import { NotesArchive } from "@/components/NotesArchive";
import { Pagination } from "@/components/Pagination";
import { generateCollectionPageSchema } from "@/utilities/generate-json-ld";
import { getLatestNotes } from "@/utilities/get-note";
import { getServerSideURL } from "@/utilities/getURL";

const NOTES_PER_PAGE = 25;

export default async function Page() {
  "use cache";

  cacheTag("notes");
  cacheTag("notes-page");
  cacheLife("notes");

  const response = await getLatestNotes(NOTES_PER_PAGE);

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page, totalDocs } = response;

  const collectionPageSchema = generateCollectionPageSchema({
    name: "Notes & Thoughts",
    description:
      "Browse quotes, thoughts, and reflections on books, movies, ideas, and life.",
    url: `${getServerSideURL()}/notes`,
    itemCount: totalDocs,
    items: docs.map((note) => ({
      url: `${getServerSideURL()}/notes/${note.slug}`,
    })),
  });

  return (
    <>
      <h1 className="sr-only">All Notes & Thoughts</h1>

      <JsonLd data={collectionPageSchema} />

      <Suspense fallback={<SkeletonGrid />}>
        <NotesArchive notes={docs} />
      </Suspense>

      {totalPages > 1 && page && (
        <Pagination
          basePath="/notes/page"
          firstPagePath="/notes"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  );
}

export const metadata: Metadata = {
  title: "All Notes & Thoughts | Lyóvson.com",
  description:
    "Browse quotes, thoughts, and reflections on books, movies, ideas, and life.",
  openGraph: {
    title: "All Notes & Thoughts | Lyóvson.com",
    description:
      "Browse quotes, thoughts, and reflections on books, movies, ideas, and life.",
    url: `${getServerSideURL()}/notes`,
    siteName: "Lyóvson.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Notes & Thoughts | Lyóvson.com",
    description:
      "Browse quotes, thoughts, and reflections on books, movies, ideas, and life.",
  },
};
