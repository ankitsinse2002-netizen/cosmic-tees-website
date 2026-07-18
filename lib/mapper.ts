import type { Product } from "./products";

export function mapWooProduct(item: any): Product {
  return {
    id: String(item.id),
    name: item.name,

    // WooCommerce
    slug: item.slug,
    sku: item.sku,

    category: item.categories?.[0]?.name || "General",
    katakana: "",

    price: Number(item.price || 0),

    compareAt: item.regular_price
      ? Number(item.regular_price)
      : undefined,

    tag: item.on_sale ? "Sale" : undefined,

    image: item.images?.[0]?.src || "/placeholder.svg",

    gallery:
      item.images?.map((img: any) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
      })) || [],

    blurb:
      item.short_description?.replace(/<[^>]*>/g, "") ||
      item.description?.replace(/<[^>]*>/g, "") ||
      "",

    description:
      item.description?.replace(/<[^>]*>/g, "") || "",

    stockStatus: item.stock_status,

    featured: item.featured ?? false,
    isNew: false,
    bestseller: false,
  };
}