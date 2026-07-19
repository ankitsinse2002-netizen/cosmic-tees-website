import { NextRequest, NextResponse } from "next/server";
import getApi, { isWooCommerceConfigured } from "@/lib/woocommerce";
import { mapWooProduct } from "@/lib/mapper";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim() ?? "";
  const categoryId = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "latest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  let orderby = "date";
  let order: "asc" | "desc" = "desc";
  if (sort === "price_asc") {
    orderby = "price";
    order = "asc";
  } else if (sort === "price_desc") {
    orderby = "price";
    order = "desc";
  }

  const params: Record<string, string | number> = {
    status: "publish",
    per_page: PER_PAGE,
    page,
    orderby,
    order,
  };

  if (search) params.search = search;
  if (categoryId) params.category = parseInt(categoryId, 10);

  try {
    // Return empty results gracefully if WooCommerce is not configured
    if (!isWooCommerceConfigured()) {
      return NextResponse.json(
        { products: [], total: 0, totalPages: 0, page: 1, perPage: PER_PAGE },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const api = getApi();
    if (!api) {
      return NextResponse.json(
        { products: [], total: 0, totalPages: 0, page: 1, perPage: PER_PAGE },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const response = await api.get("products", params);

    const total = parseInt(
      (response.headers as Record<string, string>)?.["x-wp-total"] ?? "0",
      10,
    );
    const totalPages = parseInt(
      (response.headers as Record<string, string>)?.["x-wp-totalpages"] ?? "1",
      10,
    );

    return NextResponse.json(
      {
        products: response.data.map(mapWooProduct),
        total,
        totalPages,
        page,
        perPage: PER_PAGE,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("[/api/shop] error:", error);
    return NextResponse.json(
      { products: [], total: 0, totalPages: 0, page: 1, perPage: PER_PAGE },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
