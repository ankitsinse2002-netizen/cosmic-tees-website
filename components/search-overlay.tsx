"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { formatCurrency } from "@/lib/payment";

type SearchProduct = {
  id: string;
  slug?: string;
  name: string;
  image: string;
  category: string;
  price: number;
};

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchProduct[]>([]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setLoading(false);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/shop?search=${encodeURIComponent(trimmed)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!isCancelled) {
            setResults([]);
          }
          return;
        }

        const data = (await response.json()) as { products?: SearchProduct[] };
        if (!isCancelled) {
          setResults(Array.isArray(data.products) ? data.products.slice(0, 8) : []);
        }
      } catch {
        if (!isCancelled) {
          setResults([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }, 220);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [open, query]);

  const showEmptyState = useMemo(
    () => query.trim().length > 0 && !loading && results.length === 0,
    [query, loading, results.length],
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-background/75 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative mx-auto mt-16 w-[min(680px,92vw)] rounded-2xl border border-border/70 bg-card/95 p-4 shadow-2xl sm:mt-20 sm:p-6">
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
          />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition hover:text-foreground"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-auto">
          {loading ? (
            <p className="p-3 text-sm text-muted-foreground">Searching products...</p>
          ) : null}

          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={product.slug ? `/product/${product.slug}` : "/shop"}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/70 p-3 transition hover:border-primary/50"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {product.category || "Product"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(product.price)}</p>
                </Link>
              ))}
            </div>
          ) : null}

          {showEmptyState ? (
            <p className="p-3 text-sm text-muted-foreground">No products found for "{query.trim()}".</p>
          ) : null}

          {!query.trim() ? (
            <p className="p-3 text-sm text-muted-foreground">
              Search by product name, category, or keyword.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}