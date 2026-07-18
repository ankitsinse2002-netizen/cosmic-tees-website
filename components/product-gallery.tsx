"use client";

import { useState } from "react";

type GalleryImage = {
  id?: number;
  src: string;
  alt?: string;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  fallback: string;
};

export function ProductGallery({
  images,
  fallback,
}: ProductGalleryProps) {
  const gallery =
    images.length > 0
      ? images
      : [{ src: fallback, alt: "Product Image" }];

  const [selected, setSelected] = useState(gallery[0]);

  return (
    <div className="grid gap-4 lg:grid-cols-[100px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {gallery.map((image, index) => (
          <button
            key={image.id ?? index}
            onClick={() => setSelected(image)}
            className={`overflow-hidden rounded-lg border transition ${
              selected.src === image.src
                ? "border-primary"
                : "border-border"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt || ""}
              className="h-20 w-20 object-cover"
            />
          </button>
        ))}
      </div>

      <div className="order-1 overflow-hidden rounded-xl border border-border bg-card lg:order-2">
        <img
          src={selected.src}
          alt={selected.alt || ""}
          className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
}