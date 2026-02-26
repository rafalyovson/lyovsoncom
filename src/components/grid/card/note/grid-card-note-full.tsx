import { Brain, Calendar, PenTool, Quote } from "lucide-react";
import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Badge } from "@/components/ui/badge";
import type { Note, Topic } from "@/payload-types";
import {
  extractLexicalText,
  extractLexicalTextWithNewlines,
} from "@/utilities/extract-lexical-text";
import { getTopicBadgeStyle } from "@/utilities/topicBadgeStyle";

const QUOTE_PREVIEW_MAX_CHARS = 360;
const THOUGHT_PREVIEW_MAX_CHARS = 520;
const MAX_TOPIC_STAGGER = 6;
const UNKNOWN_NOTE_SLUG = "unknown";

export interface GridCardNoteProps {
  className?: string;
  loading?: "lazy" | "eager";
  note: Note;
  priority?: boolean;
}

interface NotePreview {
  attribution: string | null;
  excerpt: string;
  isMultiLineThought: boolean;
  isPoem: boolean;
  isQuote: boolean;
  isTruncated: boolean;
}

function getNoteUrl(slug: Note["slug"]): string {
  return `/notes/${slug ?? UNKNOWN_NOTE_SLUG}`;
}

function getAttribution(note: Pick<Note, "quotedPerson" | "sourceReference">) {
  const referenceTitle =
    note.sourceReference && typeof note.sourceReference === "object"
      ? note.sourceReference.title
      : null;

  return note.quotedPerson || referenceTitle || null;
}

function getPreviewText(isQuote: boolean, content: Note["content"]): string {
  return isQuote
    ? extractLexicalTextWithNewlines(content).trim()
    : extractLexicalText(content).trim();
}

function getNotePreview(
  note: Pick<Note, "type" | "content" | "quotedPerson" | "sourceReference">
): NotePreview {
  const isQuote = note.type === "quote";
  const previewText = getPreviewText(isQuote, note.content);
  const maxChars = isQuote
    ? QUOTE_PREVIEW_MAX_CHARS
    : THOUGHT_PREVIEW_MAX_CHARS;
  const isTruncated = previewText.length > maxChars;
  const excerpt = isTruncated
    ? previewText.slice(0, maxChars).trimEnd()
    : previewText;

  return {
    attribution: getAttribution(note),
    excerpt,
    isMultiLineThought: !isQuote && previewText.includes("\n"),
    isPoem: isQuote && previewText.includes("\n"),
    isQuote,
    isTruncated,
  };
}

function getPublishedDateLabel(
  publishedAt: Note["publishedAt"]
): string | null {
  if (!publishedAt) {
    return null;
  }

  return new Date(publishedAt).toLocaleDateString("en-GB", {
    year: "2-digit",
    month: "short",
    day: "2-digit",
  });
}

function getUniqueTopics(topics: Note["topics"]): Topic[] {
  if (!Array.isArray(topics) || topics.length === 0) {
    return [];
  }

  const uniqueTopics = new Map<number, Topic>();

  for (const topic of topics) {
    if (
      typeof topic !== "object" ||
      topic === null ||
      typeof topic.id !== "number"
    ) {
      continue;
    }

    if (!uniqueTopics.has(topic.id)) {
      uniqueTopics.set(topic.id, topic);
    }
  }

  return [...uniqueTopics.values()];
}

function getTopicStaggerClass(index: number): string {
  return `glass-stagger-${Math.min(index + 1, MAX_TOPIC_STAGGER)}`;
}

function NoteQuoteContent({
  attribution,
  excerpt,
  isPoem,
  isTruncated,
}: Pick<NotePreview, "attribution" | "excerpt" | "isPoem" | "isTruncated">) {
  return (
    <div className="relative flex h-full flex-col justify-start px-6 py-6">
      <p
        className={[
          "glass-text overflow-hidden break-words pr-10 text-left text-[15px] italic leading-snug",
          isPoem ? "whitespace-pre-line" : "whitespace-normal",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isPoem ? excerpt : `“${excerpt}”`}
      </p>

      {isTruncated && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--glass-bg)] to-transparent" />
      )}

      {(isTruncated || attribution) && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {isTruncated && (
              <span className="glass-text-secondary text-xs tracking-widest">
                ***
              </span>
            )}
          </div>
          <div className="min-w-0 text-right">
            {attribution && (
              <cite className="glass-text-secondary block truncate font-normal text-xs not-italic before:mr-2 before:content-['—']">
                {attribution}
              </cite>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NoteThoughtContent({
  excerpt,
  isMultiLineThought,
  isTruncated,
}: Pick<NotePreview, "excerpt" | "isMultiLineThought" | "isTruncated">) {
  return (
    <div className="relative flex h-full flex-col justify-start px-6 py-6">
      <p
        className={[
          "glass-text overflow-hidden text-pretty break-words pr-10 text-left text-[15px] leading-relaxed",
          "tracking-[-0.01em]",
          isMultiLineThought ? "whitespace-pre-line" : "whitespace-normal",
        ].join(" ")}
      >
        {excerpt}
      </p>

      {isTruncated && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[color:var(--glass-bg)] to-transparent" />
          <span className="glass-text-secondary pointer-events-none absolute right-6 bottom-4 text-xs tracking-widest">
            ***
          </span>
        </>
      )}
    </div>
  );
}

function NoteContentPreview({
  noteUrl,
  preview,
}: {
  noteUrl: string;
  preview: NotePreview;
}) {
  return (
    <Link className="group block h-full" href={noteUrl}>
      {preview.isQuote ? (
        <NoteQuoteContent
          attribution={preview.attribution}
          excerpt={preview.excerpt}
          isPoem={preview.isPoem}
          isTruncated={preview.isTruncated}
        />
      ) : (
        <NoteThoughtContent
          excerpt={preview.excerpt}
          isMultiLineThought={preview.isMultiLineThought}
          isTruncated={preview.isTruncated}
        />
      )}
    </Link>
  );
}

export const GridCardNoteFull = ({ note, className }: GridCardNoteProps) => {
  const {
    slug,
    type,
    publishedAt,
    author,
    topics,
    content,
    quotedPerson,
    sourceReference,
  } = note;

  const noteUrl = getNoteUrl(slug);
  const isQuoteType = type === "quote";
  const typeLabel = isQuoteType ? "quote" : "thought";
  const preview = getNotePreview({
    type,
    content,
    quotedPerson,
    sourceReference,
  });
  const publishedDateLabel = getPublishedDateLabel(publishedAt);
  const uniqueTopics = getUniqueTopics(topics);

  return (
    <GridCard className={className}>
      <GridCardSection className="col-start-1 col-end-4 row-start-1 row-end-3 flex h-full flex-col overflow-hidden">
        <NoteContentPreview noteUrl={noteUrl} preview={preview} />
      </GridCardSection>

      <GridCardSection className="col-start-1 col-end-2 row-start-3 row-end-4 flex h-full flex-col items-center justify-end gap-2">
        {uniqueTopics.map((topic, index) => {
          if (!topic.slug) {
            return null;
          }

          return (
            <Link
              aria-label={`View notes about ${topic.name}`}
              className={`w-full font-semibold text-xs ${getTopicStaggerClass(index)}`}
              href={{ pathname: `/topics/${topic.slug}` }}
              key={topic.id}
            >
              <Badge
                className="glass-badge glass-text w-full shadow-md"
                style={getTopicBadgeStyle(topic.color)}
                variant="default"
              >
                {topic.name}
              </Badge>
            </Link>
          );
        })}
      </GridCardSection>

      <GridCardSection className="col-start-2 col-end-3 row-start-3 row-end-4 flex flex-col justify-evenly gap-2">
        {author && (
          <div className="glass-text-secondary flex items-center gap-2 text-xs capitalize">
            <PenTool aria-hidden="true" className="h-5 w-5" />
            <span className="font-medium">{author}</span>
          </div>
        )}

        <div className="glass-text-secondary flex items-center gap-2 text-xs">
          <Calendar aria-hidden="true" className="h-5 w-5" />
          <time dateTime={publishedAt || undefined}>{publishedDateLabel}</time>
        </div>
      </GridCardSection>

      <GridCardSection className="col-start-3 col-end-4 row-start-3 row-end-4 flex h-full flex-col items-center justify-center gap-1">
        <Link
          className="group block flex flex-col items-center gap-1"
          href={noteUrl}
        >
          {isQuoteType ? (
            <Quote
              aria-hidden="true"
              className="glass-text h-5 w-5 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
            />
          ) : (
            <Brain
              aria-hidden="true"
              className="glass-text h-5 w-5 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
            />
          )}
          <span className="glass-text-secondary text-xs capitalize transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]">
            {typeLabel}
          </span>
        </Link>
      </GridCardSection>
    </GridCard>
  );
};
