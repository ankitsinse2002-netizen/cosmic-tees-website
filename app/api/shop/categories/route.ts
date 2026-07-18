import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export const revalidate = 300; // re-fetch categories every 5 minutes

export async function GET() {
  try {
    const response = await api.get("products/categories", {
      hide_empty: false,
      per_page: 100,
      orderby: "count",
      order: "desc",
    });

    const categories = (response.data as any[]).map((cat) => ({
      id: cat.id as number,
      name: cat.name as string,
      slug: cat.slug as string,
      count: cat.count as number,
      description: String(cat.description ?? "").replace(/<[^>]*>/g, "").trim(),
      image: cat.image
        ? {
            id: cat.image.id as number | undefined,
            src: cat.image.src as string | undefined,
            alt: cat.image.alt as string | undefined,
          }
        : undefined,
    }));

    return NextResponse.json(categories, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[/api/shop/categories] error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
