import { NextRequest, NextResponse } from "next/server";

import { CodOrderCreationError, createCodOrderFromCart } from "@/lib/payment-order";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      checkout?: unknown;
      paymentMethod?: string;
      idempotencyKey?: string;
    };

    if (!body.checkout || typeof body.checkout !== "object") {
      return NextResponse.json({ message: "Checkout data is required." }, { status: 400 });
    }

    if (!body.idempotencyKey) {
      return NextResponse.json({ message: "Missing idempotency key." }, { status: 400 });
    }

    const result = await createCodOrderFromCart({
      requestUrl: request.url,
      headers: new Headers({
        cookie: request.headers.get("cookie") || "",
        "cart-token": request.headers.get("cart-token") || request.headers.get("x-wc-store-cart-token") || "",
        nonce: request.headers.get("nonce") || request.headers.get("x-wp-nonce") || "",
      }),
      body: {
        checkout: body.checkout as any,
        paymentMethod: body.paymentMethod === "razorpay" ? "razorpay" : "cod",
        idempotencyKey: body.idempotencyKey,
      },
    });

    return NextResponse.json(result.body, {
      status: result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof CodOrderCreationError) {
      return NextResponse.json(
        {
          message: error.message,
          details: error.details,
        },
        { status: error.status },
      );
    }

    const message = error instanceof Error && error.message === "request-timeout"
      ? "Payment request timed out. Please try again."
      : error instanceof Error && error.message === "cart-unavailable"
        ? "Unable to load the current cart."
        : error instanceof Error
          ? error.message
          : "Unable to create the order.";

    const status = error instanceof Error && error.message === "request-timeout" ? 504 : 502;

    console.error("[/api/payment/cod] error:", {
      message,
      status,
      error,
    });
    return NextResponse.json({ message }, { status });
  }
}