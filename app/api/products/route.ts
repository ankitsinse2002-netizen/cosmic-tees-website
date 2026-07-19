import { NextResponse } from "next/server";
import getApi from "@/lib/woocommerce";

export async function GET() {
  try {
    const api = getApi();
    const response = await api.get("products");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
