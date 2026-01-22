import configPromise from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { getPayload } from "payload";
import { Suspense } from "react";

import { GridCardContent, GridCardHeroNote, GridCardRelatedNotes } from "@/components/grid";
import { JsonLd } from "@/components/JsonLd";
import RichText from "@/components/RichText";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Note, Reference } from "@/payload-types";
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from "@/utilities/generate-json-ld";
import { extractLexicalText } from "@/utilities/extract-lexical-text";
import { getNote } from "@/utilities/get-note";
import { getServerSideURL } from "@/utilities/getURL";

const NOTE_META_DESCRIPTION_MAX_LENGTH = 160;

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export default async function NotePage({ params: paramsPromise }: Args) {
  "use cache";

  const { slug } = await paramsPromise;

  cacheTag("notes");
  cacheTag(`note-${slug}`);
  cacheLife("notes");

  const note = await getNote(slug);
  if (!note?.content) {
    return notFound();
  }

  const articleSchema = generateArticleSchema({
    title: note.title,
    slug,
    pathPrefix: "/notes",
    publishedAt: note.publishedAt || undefined,
    updatedAt: note.updatedAt || undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: getServerSideURL() },
    { name: "Notes", url: `${getServerSideURL()}/notes` },
    { name: note.title },
  ]);

  const references = getNoteReferences(note);

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <GridCardHeroNote note={note} references={references} />

      <GridCardContent
        className={cn(
          "g2:col-start-2 g2:col-end-3 g2:row-auto g2:row-start-3",
          "g3:col-end-4 g3:row-start-2 g3:w-[816px]"
        )}
      >
        <div className="prose prose-lg glass-stagger-3 prose-headings:glass-text prose-p:glass-text prose-a:glass-text prose-li:glass-text prose-blockquote:glass-text-secondary max-w-none">
          {note.type === "quote" && note.quotedPerson && (
            <p className="glass-text-secondary mb-4 text-right text-sm not-italic before:content-['—'] before:mr-2">
              {note.quotedPerson}
            </p>
          )}
          <RichText
            className="h-full"
            content={note.content}
            enableGutter={false}
            enableProse={true}
          />
        </div>
      </GridCardContent>

      {/* Related Notes - Under nav on desktop */}
      <aside
        className={cn(
          "col-start-1 col-end-2 row-start-6 row-end-7 self-start",
          "g2:col-start-1 g2:col-end-2 g2:row-start-2 g2:row-end-3"
        )}
      >
        <Suspense
          fallback={
            <div className="glass-section glass-loading h-[400px] w-[400px] animate-pulse rounded-xl">
              <Skeleton className="glass-badge h-full w-full" />
            </div>
          }
        >
          <RelatedNotes
            recommendedIds={note.recommended_note_ids as number[] | undefined}
          />
        </Suspense>
      </aside>
    </>
  );
}

async function RelatedNotes({
  recommendedIds,
}: {
  recommendedIds?: number[];
}) {
  // Early return if no recommendations stored
  if (!recommendedIds || recommendedIds.length === 0) {
    return null;
  }

  // Fetch the recommended notes by their stored IDs
  const payload = await getPayload({ config: configPromise });
  const notes = await payload.find({
    collection: "notes",
    where: {
      id: {
        in: recommendedIds,
      },
    },
    depth: 1,
    limit: recommendedIds.length,
  });

  if (notes.docs.length === 0) {
    return null;
  }

  return <GridCardRelatedNotes notes={notes.docs} />;
}


function getNoteReferences(note: Note): Reference[] {
  const refs: Reference[] = [];

  if (note.type === "quote") {
    const source = note.sourceReference;
    if (typeof source === "object" && source !== null) {
      refs.push(source as Reference);
    }
  }

  const connections = note.connections;
  if (!connections) {
    return refs;
  }

  for (const connection of connections) {
    if (
      typeof connection === "object" &&
      connection !== null &&
      "relationTo" in connection &&
      connection.relationTo === "references" &&
      typeof connection.value === "object" &&
      connection.value !== null
    ) {
      refs.push(connection.value as Reference);
    }
  }

  return refs;
}

export async function generateStaticParams() {
  "use cache";
  cacheTag("notes");
  cacheLife("static");

  const { getPayload } = await import("payload");
  const configPromise = await import("@payload-config");
  const payload = await getPayload({ config: configPromise.default });
  const notes = await payload.find({
    collection: "notes",
    where: {
      _status: {
        equals: "published",
      },
    },
    limit: 1000,
  });

  return notes.docs
    .filter((note) => typeof note === "object" && "slug" in note && note.slug)
    .map((note) => ({
      slug: (note as { slug: string }).slug,
    }));
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  "use cache";

  const { slug } = await paramsPromise;

  cacheTag("notes");
  cacheTag(`note-${slug}`);
  cacheLife("notes");

  const note = await getNote(slug);
  if (!note) {
    return {
      title: "Not Found | Lyovson.com",
      description: "The requested note could not be found",
    };
  }

  const title = note.title;
  const contentText = note.content ? extractLexicalText(note.content).trim() : "";
  const description =
    contentText.length > 0
      ? contentText.slice(0, NOTE_META_DESCRIPTION_MAX_LENGTH)
      : "A note or thought";

  return {
    title: `${title} | Lyóvson.com`,
    description,
    alternates: {
      canonical: `/notes/${slug}`,
    },
    openGraph: {
      title: `${title} | Lyóvson.com`,
      description,
      url: `${getServerSideURL()}/notes/${slug}`,
      siteName: "Lyóvson.com",
      type: "article",
      publishedTime: note.publishedAt || undefined,
      modifiedTime: note.updatedAt || undefined,
    },
    twitter: {
      card: "summary",
      title: `${title} | Lyóvson.com`,
      description,
    },
  };
}
