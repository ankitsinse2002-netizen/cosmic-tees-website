"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { ShopGrid } from "@/components/shop-grid";
import { ShopPagination } from "@/components/shop-pagination";
import type { WooCollectionCategory } from "@/lib/collections";
import type { Product } from "@/lib/products";

type CollectionClientProps = {
  categories: WooCollectionCategory[];
  currentCategory: WooCollectionCategory;
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  sort: string;
};

function buildCollectionUrl(slug: string, sort: string, page: number) {
  const params = new URLSearchParams();

  if (sort !== "latest") {
    params.set("sort", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/collections/${slug}?${query}` : `/collections/${slug}`;
}

function CollectionToolbar({
  categories,
  currentCategory,
  total,
  sort,
  onCategoryChange,
  onSortChange,
}: {
  categories: WooCollectionCategory[];
  currentCategory: WooCollectionCategory;
  total: number;
  sort: string;
  onCategoryChange: (slug: string) => void;
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
      <div className="shrink-0">
        <h2 className="text-xl font-bold uppercase tracking-wide">
          {currentCategory.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {total} Product{total === 1 ? "" : "s"} Available
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:items-center">
        <select
          value={currentCategory.slug}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          aria-label="Switch collection"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
          aria-label="Sort collection"
        >
          <option value="latest">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

function EmptyState({ currentCategory }: { currentCategory: WooCollectionCategory }) {
  return (
    <div className="rounded-sm border border-border bg-card p-10 text-center shadow-sm">
      <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
        No products in this collection yet
      </h2>
      <p className="mt-3 text-muted-foreground">
        This WooCommerce collection is live, but there are no published products
        available right now.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-primary hover:text-primary"
        >
          Browse Shop
        </Link>
        <Link
          href={`/collections/${currentCategory.slug}`}
          className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-primary hover:text-primary"
        >
          Refresh Collection
        </Link>
      </div>
    </div>
  );
}

export function CollectionClient({
  categories,
  currentCategory,
  products,
  total,
  totalPages,
  page,
  sort,
}: CollectionClientProps) {
  const router = useRouter();

  const navigate = (slug: string, nextSort: string, nextPage: number) => {
    router.push(buildCollectionUrl(slug, nextSort, nextPage), {
      scroll: false,
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8">
        <div className="overflow-hidden rounded-sm border border-border bg-card shadow-sm">
          <div className="relative min-h-[220px]">
            {currentCategory.image?.src ? (
              <img
                src={currentCategory.image.src}
                alt={currentCategory.image.alt || currentCategory.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/25" />

            <div className="relative flex min-h-[220px] flex-col justify-end gap-4 p-6 sm:p-8 lg:p-10">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
              >
                <Link href="/" className="transition hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span>Collections</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground">{currentCategory.name}</span>
              </nav>

              <div className="max-w-3xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Collection
                </p>
                <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
                  {currentCategory.name}
                </h1>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                  {currentCategory.description ||
                    "Browse the latest products in this WooCommerce collection."}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 backdrop-blur">
                    {total} Product{total === 1 ? "" : "s"}
                  </span>
                  <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 backdrop-blur">
                    Category: {currentCategory.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CollectionToolbar
          categories={categories}
          currentCategory={currentCategory}
          total={total}
          sort={sort}
          onCategoryChange={(slug) => navigate(slug, sort, 1)}
          onSortChange={(value) => navigate(currentCategory.slug, value, 1)}
        />

        {products.length > 0 ? (
          <ShopGrid products={products} />
        ) : (
          <EmptyState currentCategory={currentCategory} />
        )}

        <ShopPagination
          page={page}
          totalPages={totalPages}
          onPage={(nextPage) => {
            navigate(currentCategory.slug, sort, nextPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </section>
  );
}