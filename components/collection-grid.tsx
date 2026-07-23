"use client";

import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

type CollectionGridProps = {
  products: Product[];
  title: string;
};

export function CollectionGrid({ products, title }: CollectionGridProps) {
  const { items, addItem } = useCart();

  const addToCart = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (product) {
      addItem(product);
    }
  };

  if (!products.length) {
    return (
      <div className="rounded-sm border border-border bg-card p-10 text-center shadow-sm">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
          No products in this collection yet
        </h2>
        <p className="mt-3 text-muted-foreground">
          This collection is being curated. Check back soon or browse the full
          shop for other standout drops.
        </p>
        <a
          href="/shop"
          className="mt-6 inline-flex items-center justify-center rounded-sm border border-border bg-background px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-primary hover:text-primary"
        >
          Browse Shop
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          added={items.some((item) => item.product.id === product.id)}
          onAdd={addToCart}
        />
      ))}
    </div>
  );
}
