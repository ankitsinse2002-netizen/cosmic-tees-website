import { NextResponse } from "next/server";
import { getCuratedCollectionCategories } from "@/lib/collections";

export const revalidate = 300; // re-fetch categories every 5 minutes

export async function GET() {
  try {
    const categories = await getCuratedCollectionCategories();

    return NextResponse.json(categories, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[/api/shop/categories] error:", error);
    return NextResponse.json([], {
      status: 502,
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=60" },
    });
  }
}
