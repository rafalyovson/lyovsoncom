import { Brain, Calendar, PenTool, Quote } from "lucide-react";
import Link from "next/link";

import { GridCard, GridCardSection } from "@/components/grid";
import { Badge } from "@/components/ui/badge";
import type { Note } from "@/payload-types";
import {
  extractLexicalText,
  extractLexicalTextWithNewlines,
} from "@/utilities/extract-lexical-text";

export type GridCardNoteProps = {
  note: Note;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
};

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

  const noteUrl = `/notes/${slug}`;
  const isQuoteType = type === "quote";
  const typeLabel = isQuoteType ? "quote" : "thought";

  const isQuote = isQuoteType;
  const previewText = isQuote
    ? extractLexicalTextWithNewlines(content).trim()
    : extractLexicalText(content).trim();
  const isPoem = isQuote && previewText.includes("\n");
  const isMultiLineThought = !isQuote && previewText.includes("\n");
  const maxChars = isQuote ? 360 : 520;
  const isTruncated = previewText.length > maxChars;
  const excerpt = isTruncated
    ? previewText.slice(0, maxChars).trimEnd()
    : previewText;
  const attribution =
    quotedPerson ||
    (sourceReference && typeof sourceReference === "object"
      ? sourceReference?.title
      : null) ||
    null;

  return (
    <GridCard className={className}>
      <GridCardSection
        className={
          "col-start-1 col-end-4 row-start-1 row-end-3 flex h-full flex-col overflow-hidden"
        }
      >
        <Link className="group block h-full" href={noteUrl}>
          {isQuote ? (
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
          ) : (
            <div className="relative flex h-full flex-col justify-start px-6 py-6">
              <p
                className={[
                  "glass-text overflow-hidden text-pretty break-words pr-10 text-left text-[15px] leading-relaxed",
                  "tracking-[-0.01em]",
                  isMultiLineThought
                    ? "whitespace-pre-line"
                    : "whitespace-normal",
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
          )}
        </Link>
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-1 col-end-2 row-start-3 row-end-4 flex h-full flex-col items-center justify-center gap-1"
        }
      >
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

      <GridCardSection
        className={
          "col-start-2 col-end-3 row-start-3 row-end-4 flex flex-col justify-evenly gap-2"
        }
      >
        {author && (
          <div className="glass-text-secondary flex items-center gap-2 text-xs capitalize">
            <PenTool aria-hidden="true" className="h-5 w-5" />
            <span className="font-medium">{author}</span>
          </div>
        )}

        <div className="glass-text-secondary flex items-center gap-2 text-xs">
          <Calendar aria-hidden="true" className="h-5 w-5" />
          <time dateTime={publishedAt || undefined}>
            {publishedAt &&
              new Date(publishedAt).toLocaleDateString("en-GB", {
                year: "2-digit",
                month: "short",
                day: "2-digit",
              })}
          </time>
        </div>
      </GridCardSection>

      <GridCardSection
        className={
          "col-start-3 col-end-4 row-start-3 row-end-4 flex flex-col items-center justify-end gap-2"
        }
      >
        {topics
          ?.filter((topic, index, self) => {
            // Deduplicate topics by ID
            if (typeof topic !== "object" || !topic?.id) {
              return false;
            }
            return (
              index ===
              self.findIndex((t) => typeof t === "object" && t?.id === topic.id)
            );
          })
          .map((topic, index) => {
            if (typeof topic !== "object" || !topic?.slug || !topic?.id) {
              return null;
            }
            return (
              <Link
                aria-label={`View notes about ${topic.name}`}
                className={`w-full font-semibold text-xs glass-stagger-${Math.min(index + 1, 6)}`}
                href={{ pathname: `/topics/${topic.slug}` }}
                key={topic.id}
              >
                <Badge
                  className="glass-badge glass-text w-full shadow-md"
                  style={{
                    backgroundColor: topic.color || "var(--glass-bg)",
                    color: "var(--glass-text)",
                  }}
                  variant="default"
                >
                  {topic.name}
                </Badge>
              </Link>
            );
          })}
      </GridCardSection>
    </GridCard>
  );
};
