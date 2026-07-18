"use client";

import { Search, X } from "lucide-react";

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type ShopToolbarProps = {
  total: number;
  search: string;
  category: string;
  sort: string;
  categories: WooCategory[];
  isLoading: boolean;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onSort: (value: string) => void;
};

export function ShopToolbar({
  total,
  search,
  category,
  sort,
  categories,
  isLoading,
  onSearch,
  onCategory,
  onSort,
}: ShopToolbarProps) {
  const hasActiveFilters = search || category;

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="shrink-0">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          All Products
        </h2>
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            <span className="inline-block h-4 w-32 animate-pulse rounded bg-secondary" />
          ) : (
            <>
              {total} Product{total !== 1 ? "s" : ""} Available
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-9 text-sm outline-none transition focus:border-primary sm:w-64"
            aria-label="Search products"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          aria-label="Sort products"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onSearch("");
              onCategory("");
            }}
            className="flex h-11 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}