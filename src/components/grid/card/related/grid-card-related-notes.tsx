import { Brain, Quote } from "lucide-react";
import Link from "next/link";
import { GridCard, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";
import type { Note } from "@/payload-types";
import { extractLexicalText } from "@/utilities/extract-lexical-text";

export function GridCardRelatedNotes({
  notes,
  className,
}: {
  notes: (number | Note)[];
  className?: string;
}) {
  return (
    <GridCard className={cn(className)}>
      {notes.map((note, index) => {
        if (typeof note === "number") {
          return null;
        }

        const isQuote = note.type === "quote";
        const fullText = note.content
          ? extractLexicalText(note.content).trim()
          : "";
        const isTruncated = fullText.length > 80;
        const excerpt = isTruncated ? fullText.slice(0, 80) : fullText;

        const rowClass = `row-start-${index + 1} row-end-${index + 2}`;
        const staggerClass = `glass-stagger-${Math.min(index + 1, 6)}`;

        return (
          <Link
            aria-label={`Read related note: ${note.title}`}
            className={cn(
              "group glass-interactive col-start-1 col-end-4",
              rowClass,
              staggerClass
            )}
            href={`/notes/${note.slug}`}
            key={note.id}
          >
            <GridCardSection
              className={"grid h-full grid-cols-3 grid-rows-1 gap-2"}
            >
              {/* Icon column */}
              <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center">
                {isQuote ? (
                  <Quote
                    aria-hidden="true"
                    className="glass-text h-8 w-8 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
                  />
                ) : (
                  <Brain
                    aria-hidden="true"
                    className="glass-text h-8 w-8 transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]"
                  />
                )}
              </div>
              {/* Content column */}
              <div className="col-start-2 col-end-4 row-start-1 row-end-2 flex flex-col justify-center gap-1">
                <h2 className="glass-text font-medium text-sm transition-colors duration-300 group-hover:text-[var(--glass-text-secondary)]">
                  {note.title}
                </h2>
                {excerpt && (
                  <p className="glass-text-secondary line-clamp-2 text-xs">
                    {excerpt}
                    {isTruncated && "..."}
                  </p>
                )}
              </div>
            </GridCardSection>
          </Link>
        );
      })}
    </GridCard>
  );
}
