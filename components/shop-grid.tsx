"use client";

import { ProductCard } from "@/components/product-card";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

type ShopGridProps = {
  products: Product[];
  isLoading?: boolean;
};

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-sm border border-border bg-card">
      <div className="aspect-square bg-secondary" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-secondary" />
        <div className="h-4 w-2/3 rounded bg-secondary" />
        <div className="h-3 w-full rounded bg-secondary" />
        <div className="h-3 w-4/5 rounded bg-secondary" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-16 rounded bg-secondary" />
        </div>
        <div className="h-9 w-full rounded bg-secondary" />
      </div>
    </div>
  );
}

export function ShopGrid({ products, isLoading = false }: ShopGridProps) {
  const { items, addItem } = useCart();

  const addToCart = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (product) {
      addItem(product);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-2xl font-bold">No Products Found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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