import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { Suspense } from "react";
import { SkeletonGrid } from "@/components/grid";
import { NotesArchive } from "@/components/NotesArchive";
import { Pagination } from "@/components/Pagination";
import { getPaginatedNotes } from "@/utilities/get-note";

const NOTES_PER_PAGE = 12;
const MAX_INDEXED_PAGE = 3;

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  cacheTag("notes");
  cacheTag(`notes-page-${pageNumber}`);
  cacheLife("notes");

  if (!Number.isInteger(sanitizedPageNumber)) {
    notFound();
  }

  const response = await getPaginatedNotes(sanitizedPageNumber, NOTES_PER_PAGE);

  if (!response) {
    return notFound();
  }

  const { docs, totalPages, page } = response;

  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <NotesArchive notes={docs} />
      </Suspense>

      {totalPages > 1 && page && (
        <Pagination page={page} totalPages={totalPages} />
      )}
    </>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 2) {
    return {
      title: "Not Found | Lyovson.com",
      description: "The requested page could not be found",
    };
  }

  return {
    title: `Notes & Thoughts - Page ${sanitizedPageNumber} | Lyóvson.com`,
    description: `Browse quotes, thoughts, and reflections - Page ${sanitizedPageNumber}`,
    robots: {
      index: sanitizedPageNumber <= MAX_INDEXED_PAGE,
      follow: true,
    },
  };
}
