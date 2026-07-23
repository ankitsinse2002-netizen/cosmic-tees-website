import { NextRequest, NextResponse } from "next/server";
import getApi from "@/lib/woocommerce";
import { mapWooProduct } from "@/lib/mapper";
import { getMockCollectionProducts } from "@/lib/mock-products";

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
  const parsedCategoryId = Number.parseInt(categoryId, 10);
  if (categoryId && Number.isFinite(parsedCategoryId)) {
    params.category = parsedCategoryId;
  }

  try {
    const api = getApi();
    if (!api) {
      const mock = getMockCollectionProducts({
        page,
        perPage: PER_PAGE,
        sort: sort === "price_asc" || sort === "price_desc" ? sort : "latest",
        search,
        categoryId: Number.isFinite(parsedCategoryId) ? parsedCategoryId : undefined,
      });

      return NextResponse.json(mock, {
        headers: { "Cache-Control": "no-store" },
      });
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
    const mock = getMockCollectionProducts({
      page,
      perPage: PER_PAGE,
      sort: sort === "price_asc" || sort === "price_desc" ? sort : "latest",
      search,
      categoryId: Number.isFinite(parsedCategoryId) ? parsedCategoryId : undefined,
    });

    return NextResponse.json(mock, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
