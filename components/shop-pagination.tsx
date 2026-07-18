"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ShopPaginationProps = {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
};

export function ShopPagination({ page, totalPages, onPage }: ShopPaginationProps) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  function getPages(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  const pages = getPages();

  return (
    <nav
      aria-label="Shop pagination"
      className="mt-12 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-sm transition hover:border-primary hover:text-primary",
          page <= 1 && "cursor-not-allowed opacity-40",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-sm border text-sm font-medium transition",
              p === page
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary hover:text-primary",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-card text-sm transition hover:border-primary hover:text-primary",
          page >= totalPages && "cursor-not-allowed opacity-40",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
