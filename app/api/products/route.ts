import { NextResponse } from "next/server";
import getApi from "@/lib/woocommerce";

export async function GET() {
  try {
    const api = getApi();
    if (!api) {
      return NextResponse.json(
        { message: "WooCommerce API is not configured." },
        { status: 500 },
      );
    }

    const response = await api.get("products", {
      status: "publish",
      per_page: 100,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch products from WooCommerce." },
      { status: 502 },
    );
  }
}
