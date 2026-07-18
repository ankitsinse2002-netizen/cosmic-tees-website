import { createHash } from "crypto";

import api from "./woocommerce";
import type { CheckoutSnapshot } from "./payment";

export type StoreCartItem = {
  key?: string;
  id?: number;
  product_id?: number;
  variation_id?: number;
  quantity?: number;
  name?: string;
  variation?: Array<{ attribute?: string; value?: string }>;
  images?: Array<{ src?: string; alt?: string }>;
  prices?: {
    price?: string;
    currency_minor_unit?: number;
  };
};

export type StoreCartResponse = {
  items?: StoreCartItem[];
  item_count?: number;
  totals?: {
    subtotal?: string;
    total_shipping?: string;
    total_price?: string;
    total_discount?: string;
    currency_minor_unit?: number;
  };
};

export type CodOrderRequest = {
  checkout: CheckoutSnapshot;
  paymentMethod: "cod" | "razorpay";
  idempotencyKey: string;
};

export type CodOrderResponse = {
  orderId: number;
  orderNumber: string;
  orderKey: string;
  status: string;
  total: number;
  duplicate: boolean;
};

const requestTimeoutMs = 10000;
const duplicateWindowMs = 15 * 60 * 1000;

type StoredOrder = {
  response: CodOrderResponse;
  createdAt: number;
};

const duplicateGuard = new Map<string, StoredOrder>();

export class CodOrderCreationError extends Error {
  status: number;
  details: Record<string, unknown>;

  constructor(message: string, status: number, details: Record<string, unknown>) {
    super(message);
    this.name = "CodOrderCreationError";
    this.status = status;
    this.details = details;
  }
}

function maskSecret(value: string | undefined) {
  if (!value) return "missing";
  if (value.length <= 8) return `${value}***`;
  return `${value.slice(0, 8)}***`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractWooError(error: unknown) {
  if (!isRecord(error)) {
    return {
      message: "Unknown WooCommerce error",
      status: 502,
      responseBody: null,
    };
  }

  const response = isRecord(error.response) ? error.response : null;
  const responseBody = response ? response.data ?? null : null;
  const status = response && typeof response.status === "number" ? response.status : 502;

  let message = "Unable to create order in WooCommerce.";
  if (isRecord(responseBody) && typeof responseBody.message === "string") {
    message = responseBody.message;
  } else if (typeof error.message === "string" && error.message.trim()) {
    message = error.message;
  }

  return {
    message,
    status,
    responseBody,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = requestTimeoutMs) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("request-timeout")), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }) as Promise<T>;
}

function cleanupDuplicateGuard() {
  const cutoff = Date.now() - duplicateWindowMs;

  for (const [key, entry] of duplicateGuard.entries()) {
    if (entry.createdAt < cutoff) {
      duplicateGuard.delete(key);
    }
  }
}

function fingerprintOrder(body: CodOrderRequest, cart: StoreCartResponse) {
  const fingerprintSource = JSON.stringify({
    checkout: body.checkout,
    paymentMethod: body.paymentMethod,
    items: (cart.items ?? []).map((item) => ({
      id: item.id ?? item.product_id ?? 0,
      variationId: item.variation_id ?? 0,
      quantity: item.quantity ?? 0,
      size: item.variation?.find((variation) => variation.attribute?.toLowerCase() === "size")?.value ?? "",
    })),
    total: cart.totals?.total_price ?? "0",
  });

  return createHash("sha256").update(fingerprintSource).digest("hex");
}

export async function fetchWooCart(requestUrl: string, headers: Headers) {
  const response = await withTimeout(
    fetch(new URL("/api/cart", requestUrl), {
      headers,
      cache: "no-store",
    }),
  );

  if (!response.ok) {
    throw new Error("cart-unavailable");
  }

  return (await response.json()) as StoreCartResponse;
}

export async function createCodOrderFromCart({
  requestUrl,
  headers,
  body,
}: {
  requestUrl: string;
  headers: Headers;
  body: CodOrderRequest;
}) {
  cleanupDuplicateGuard();

  const wooBaseUrl = process.env.NEXT_PUBLIC_WC_URL || "";
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!wooBaseUrl || !consumerKey || !consumerSecret) {
    const details = {
      requestUrl,
      wooBaseUrl,
      auth: {
        hasConsumerKey: Boolean(consumerKey),
        hasConsumerSecret: Boolean(consumerSecret),
        consumerKey: maskSecret(consumerKey),
        consumerSecret: maskSecret(consumerSecret),
      },
    };

    console.error("[payment-order] WooCommerce config missing", details);
    throw new CodOrderCreationError("WooCommerce credentials are not configured correctly.", 500, details);
  }

  if (body.paymentMethod !== "cod") {
    return {
      status: 400,
      body: { message: "Only Cash on Delivery is currently available." },
    } as const;
  }

  const cart = await fetchWooCart(requestUrl, headers);
  const items = cart.items ?? [];

  if (!items.length) {
    return {
      status: 400,
      body: { message: "Your cart is empty or invalid." },
    } as const;
  }

  const fingerprint = fingerprintOrder(body, cart);
  const duplicate = duplicateGuard.get(fingerprint);
  if (duplicate) {
    return {
      status: 200,
      body: { ...duplicate.response, duplicate: true },
    } as const;
  }

  const billing = body.checkout.billing;
  const shipping = body.checkout.shipping;
  const customerNote = body.checkout.contact.orderNotes?.trim() || "";

  const subtotal = items.reduce((total, item) => {
    const unitPrice = Number(item.prices?.price || 0) / Math.pow(10, item.prices?.currency_minor_unit ?? 2);
    return total + unitPrice * Math.max(1, item.quantity || 1);
  }, 0);

  const shippingTotal = subtotal > 999 ? 0 : subtotal === 0 ? 0 : 120;
  const lineItems = items.map((item) => ({
    product_id: Number(item.product_id ?? item.id ?? 0),
    variation_id: Number(item.variation_id ?? 0) || undefined,
    quantity: Math.max(1, item.quantity || 1),
    meta_data: item.variation?.length
      ? item.variation.map((variation) => ({
          key: variation.attribute || "Variant",
          value: variation.value || "",
        }))
      : undefined,
  }));

  const invalidLineItems = lineItems.filter((item) => !Number.isFinite(item.product_id) || item.product_id <= 0);
  if (invalidLineItems.length > 0) {
    const details = {
      message: "Invalid cart product IDs detected.",
      invalidLineItems,
      cartItems: items,
    };

    console.error("[payment-order] Invalid cart items", details);
    throw new CodOrderCreationError("Invalid product in cart. Please refresh the cart and try again.", 400, details);
  }

  const orderPayload = {
    status: "on-hold",
    payment_method: "cod",
    payment_method_title: "Cash on Delivery",
    set_paid: false,
    customer_note: customerNote,
    billing: {
      first_name: billing.firstName,
      last_name: billing.lastName,
      company: billing.company || "",
      address_1: billing.address1,
      address_2: billing.address2 || "",
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: billing.country,
      email: body.checkout.contact.email,
      phone: body.checkout.contact.phone,
    },
    shipping: {
      first_name: shipping.firstName,
      last_name: shipping.lastName,
      company: shipping.company || "",
      address_1: shipping.address1,
      address_2: shipping.address2 || "",
      city: shipping.city,
      state: shipping.state,
      postcode: shipping.postcode,
      country: shipping.country,
    },
    line_items: lineItems,
    shipping_lines: [
      {
        method_id: shippingTotal > 0 ? "flat_rate" : "free_shipping",
        method_title: shippingTotal > 0 ? "Standard Shipping" : "Free Shipping",
        total: String(shippingTotal.toFixed(2)),
      },
    ],
    meta_data: [
      { key: "checkout_idempotency_key", value: body.idempotencyKey },
      { key: "source", value: "cosmic-tees-payment-page" },
      { key: "cart_fingerprint", value: fingerprint },
    ],
  };

  const endpointUrl = `${wooBaseUrl.replace(/\/$/, "")}/wp-json/wc/v3/orders`;
  console.info("[payment-order] Woo order request", {
    requestUrl,
    endpointUrl,
    paymentMethod: body.paymentMethod,
    auth: {
      hasConsumerKey: true,
      hasConsumerSecret: true,
      consumerKey: maskSecret(consumerKey),
      consumerSecret: maskSecret(consumerSecret),
    },
    requestPayload: orderPayload,
  });

  let orderResponse: Awaited<ReturnType<typeof api.post>>;
  try {
    orderResponse = await withTimeout(api.post("orders", orderPayload));
  } catch (error) {
    const wooError = extractWooError(error);
    const details = {
      requestUrl,
      endpointUrl,
      httpStatus: wooError.status,
      requestPayload: orderPayload,
      responseBody: wooError.responseBody,
      originalError: error,
    };

    console.error("[payment-order] Woo order request failed", details);
    throw new CodOrderCreationError(
      `${wooError.message} | status=${wooError.status} | response=${JSON.stringify(wooError.responseBody)}`,
      wooError.status,
      details,
    );
  }

  console.info("[payment-order] Woo order response", {
    requestUrl,
    endpointUrl,
    httpStatus: orderResponse.status,
    responseBody: orderResponse.data,
  });

  const createdOrder = orderResponse.data as { id?: number; number?: string; order_key?: string; status?: string; total?: string };

  const responsePayload: CodOrderResponse = {
    orderId: Number(createdOrder.id ?? 0),
    orderNumber: String(createdOrder.number ?? createdOrder.id ?? ""),
    orderKey: String(createdOrder.order_key ?? ""),
    status: String(createdOrder.status ?? "on-hold"),
    total: Number(createdOrder.total ?? subtotal + shippingTotal),
    duplicate: false,
  };

  duplicateGuard.set(fingerprint, {
    response: responsePayload,
    createdAt: Date.now(),
  });

  try {
    await withTimeout(
      fetch(new URL("/api/cart/items", requestUrl), {
        method: "DELETE",
        headers,
        cache: "no-store",
      }),
    );
  } catch {
    // If cart clearing fails, the client will still clear local state after redirect.
  }

  return {
    status: 200,
    body: responsePayload,
  } as const;
}