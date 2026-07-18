"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ShopGrid } from "@/components/shop-grid";
import { ShopPagination } from "@/components/shop-pagination";
import { ShopToolbar } from "@/components/shop-toolbar";
import type { Product } from "@/lib/products";

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type ShopData = {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
};

type ShopClientProps = {
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  initialPage: number;
};

export function ShopClient({
  initialSearch,
  initialCategory,
  initialSort,
  initialPage,
}: ShopClientProps) {
  const router = useRouter();

  // Toolbar state (search is separate so we can debounce it)
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Active filter state driving the actual fetch
  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    sort: initialSort,
    page: initialPage,
  });

  const [categories, setCategories] = useState<WooCategory[]>([]);
  const [shopData, setShopData] = useState<ShopData>({
    products: [],
    total: 0,
    totalPages: 1,
    page: initialPage,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const abortRef = useRef<AbortController | null>(null);

  // ─── Fetch categories once ────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/shop/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  // ─── Debounce search input → update filters ───────────────────────────────
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setFilters((prev) => ({
          ...prev,
          search: searchInput,
          // Reset to page 1 whenever the search changes
          page: searchInput !== prev.search ? 1 : prev.page,
        }));
      },
      // No debounce on initial value
      isFirstLoad ? 0 : 350,
    );
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // ─── Fetch products when filters change ───────────────────────────────────
  const fetchProducts = useCallback(
    async (activeFilters: typeof filters) => {
      // Cancel previous in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setIsLoading(true);
      try {
        const qs = new URLSearchParams();
        if (activeFilters.search) qs.set("search", activeFilters.search);
        if (activeFilters.category) qs.set("category", activeFilters.category);
        if (activeFilters.sort !== "latest") qs.set("sort", activeFilters.sort);
        if (activeFilters.page > 1) qs.set("page", String(activeFilters.page));

        const res = await fetch(`/api/shop?${qs.toString()}`, {
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ShopData = await res.json();
        setShopData(data);

        // Sync URL for shareability (without navigation/scroll)
        const urlParams = new URLSearchParams();
        if (activeFilters.search) urlParams.set("search", activeFilters.search);
        if (activeFilters.category) urlParams.set("category", activeFilters.category);
        if (activeFilters.sort !== "latest") urlParams.set("sort", activeFilters.sort);
        if (activeFilters.page > 1) urlParams.set("page", String(activeFilters.page));
        const newUrl = urlParams.toString() ? `/shop?${urlParams.toString()}` : "/shop";
        router.replace(newUrl, { scroll: false });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("[ShopClient] fetch error:", err);
          setShopData({ products: [], total: 0, totalPages: 1, page: 1 });
        }
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    },
    [router],
  );

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleCategory = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value, page: 1 }));
  };

  const handleSort = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const handlePage = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero banner */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Cosmic Tees
          </span>
          <h1 className="mt-3 font-display text-5xl font-extrabold uppercase tracking-tight">
            Shop
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Discover premium Anime, Cosmic and Streetwear collections crafted
            for everyday wear.
          </p>
        </div>
      </section>

      {/* Toolbar + Grid + Pagination */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <ShopToolbar
          total={shopData.total}
          search={searchInput}
          category={filters.category}
          sort={filters.sort}
          categories={categories}
          isLoading={isLoading}
          onSearch={handleSearch}
          onCategory={handleCategory}
          onSort={handleSort}
        />

        <ShopGrid products={shopData.products} isLoading={isLoading} />

        <ShopPagination
          page={shopData.page}
          totalPages={shopData.totalPages}
          onPage={handlePage}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
