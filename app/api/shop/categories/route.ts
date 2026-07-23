import { NextResponse } from "next/server";
import { getCuratedCollectionCategories } from "@/lib/collections";

export const revalidate = 300; // re-fetch categories every 5 minutes

const categoriesFallback = [
  {
    id: -1,
    slug: "men",
    name: "Men",
    description: "Premium Drop and Essential Series",
    count: 0,
    image: { src: "/category-cosmic.png", alt: "Men collection" },
  },
  {
    id: -2,
    slug: "women",
    name: "Women",
    description: "Premium Drop and Essential Series",
    count: 0,
    image: { src: "/category-anime.png", alt: "Women collection" },
  },
  {
    id: -3,
    slug: "quotes",
    name: "Quotes (Unisex)",
    description: "All quote designs in one collection",
    count: 0,
    image: { src: "/category-quotes.png", alt: "Quotes (Unisex) collection" },
  },
];

export async function GET() {
  try {
    const categories = await getCuratedCollectionCategories();

    return NextResponse.json(categories, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[/api/shop/categories] error:", error);
    return NextResponse.json(categoriesFallback, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  }
}
