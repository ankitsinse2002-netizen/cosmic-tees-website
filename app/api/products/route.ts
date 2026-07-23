import { NextResponse } from "next/server";
import getApi from "@/lib/woocommerce";
import { getMockApiProducts } from "@/lib/mock-products";

export async function GET() {
  try {
    const api = getApi();
    if (!api) {
      return NextResponse.json(getMockApiProducts());
    }

    const response = await api.get("products");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(getMockApiProducts());
  }
}
