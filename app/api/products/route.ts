import { NextResponse } from "next/server";
import getApi, { isWooCommerceConfigured } from "@/lib/woocommerce";

export async function GET() {
  try {
    // Return empty array gracefully if WooCommerce is not configured
    if (!isWooCommerceConfigured()) {
      return NextResponse.json([]);
    }

    const api = getApi();
    if (!api) {
      return NextResponse.json([]);
    }

    const response = await api.get("products");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}
