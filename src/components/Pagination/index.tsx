"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo } from "react";

import { GridCard, GridCardSection } from "@/components/grid";
import { cn } from "@/lib/utils";

type PaginationProps = {
  className?: string;
  page: number;
  totalPages: number;
  createHref?: (page: number) => string;
};

const MAX_WINDOW_SIZE = 7;
const WINDOW_RADIUS = Math.floor(MAX_WINDOW_SIZE / 2);

const buildWindow = (page: number, totalPages: number): (number | null)[] => {
  if (totalPages <= 0) {
    return new Array(MAX_WINDOW_SIZE).fill(null);
  }

  if (totalPages <= MAX_WINDOW_SIZE) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    return [...pages, ...new Array(MAX_WINDOW_SIZE - pages.length).fill(null)];
  }

  let start = page - WINDOW_RADIUS;
  if (start < 1) {
    start = 1;
  }

  let end = start + (MAX_WINDOW_SIZE - 1);

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - (MAX_WINDOW_SIZE - 1));
  }

  const pages: number[] = [];
  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return pages;
};

const defaultHrefBuilder = (page: number) => {
  if (page <= 1) {
    return "/posts";
  }

  return `/posts/page/${page}`;
};

const cellPositions = [
  "col-start-1 col-end-2 row-start-1 row-end-2",
  "col-start-2 col-end-3 row-start-1 row-end-2",
  "col-start-3 col-end-4 row-start-1 row-end-2",
  "col-start-1 col-end-2 row-start-2 row-end-3",
  "col-start-2 col-end-3 row-start-2 row-end-3",
  "col-start-3 col-end-4 row-start-2 row-end-3",
  "col-start-1 col-end-2 row-start-3 row-end-4",
  "col-start-2 col-end-3 row-start-3 row-end-4",
  "col-start-3 col-end-4 row-start-3 row-end-4",
];

export const Pagination = ({
  className,
  page,
  totalPages,
  createHref,
}: PaginationProps) => {
  const router = useRouter();

  const windowPages = useMemo(
    () => buildWindow(page, totalPages),
    [page, totalPages]
  );

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const navigateTo = (target: number) => {
    if (target < 1 || target > totalPages || target === page) {
      return;
    }

    const hrefBuilder = createHref ?? defaultHrefBuilder;
    router.push(hrefBuilder(target));
  };

  const windowCells = [...windowPages];
  while (windowCells.length < MAX_WINDOW_SIZE) {
    windowCells.push(null);
  }

  type GridCell = {
    key: string;
    label: number | null | ReactNode;
    ariaLabel?: string;
    disabled: boolean;
    target: number;
    isCurrent: boolean;
  };

  const gridCells: GridCell[] = [
    {
      key: "first",
      label: <ChevronsLeft aria-hidden="true" className="h-5 w-5" />,
      ariaLabel: "Go to first page",
      disabled: !hasPrev,
      target: 1,
      isCurrent: false,
    },
    ...windowCells.map((value, index) => {
      if (value == null) {
        return {
          key: `empty-${index}`,
          label: null,
          ariaLabel: undefined,
          disabled: true,
          target: page,
          isCurrent: false,
        };
      }

      return {
        key: `page-${value}`,
        label: value,
        ariaLabel: `Go to page ${value}`,
        disabled: value === page,
        target: value,
        isCurrent: value === page,
      };
    }),
    {
      key: "next",
      label: <ChevronsRight aria-hidden="true" className="h-5 w-5" />,
      ariaLabel: "Go to next page",
      disabled: !hasNext,
      target: page + 1,
      isCurrent: false,
    },
  ];

  return (
    <div className={cn("mx-auto flex justify-center", className)}>
      <GridCard interactive={false}>
        {gridCells.map((cell, index) => {
          const positionClass = cellPositions[index];
          const isDisabled = Boolean(cell.disabled);
          const isNumeric = typeof cell.label === "number";

          if (!cell.label) {
            return (
              <GridCardSection
                aria-hidden="true"
                className={positionClass}
                interactive={false}
                key={cell.key}
              >
                <div />
              </GridCardSection>
            );
          }

          return (
            <GridCardSection
              asChild
              className={cn(
                positionClass,
                "flex items-center justify-center text-lg",
                isNumeric && "font-semibold",
                cell.isCurrent && "glass-premium",
                isDisabled && !cell.isCurrent && "opacity-45"
              )}
              interactive={!isDisabled}
              key={cell.key}
              onClick={isDisabled ? undefined : () => navigateTo(cell.target)}
            >
              <button
                aria-current={cell.isCurrent ? "page" : undefined}
                aria-label={cell.ariaLabel}
                className="flex h-full w-full items-center justify-center"
                disabled={isDisabled}
                type="button"
              >
                {isNumeric ? <span>{cell.label}</span> : cell.label}
              </button>
            </GridCardSection>
          );
        })}
      </GridCard>
    </div>
  );
};
