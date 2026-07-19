"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/lib/products";

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  size: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, size?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, delta: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  isLoading: boolean;
};

type StoreCartResponse = {
  items?: Array<{
    key: string;
    id: number;
    quantity: number;
    name: string;
    images?: Array<{ src: string; alt?: string }>;
    prices?: {
      price?: string;
      currency_minor_unit?: number;
    };
    variation?: Array<{ attribute: string; value: string }>;
  }>;
  item_count?: number;
  totals?: {
    subtotal?: string;
    total_shipping?: string;
    total_price?: string;
  };
};

type StoreCartErrorResponse = {
  data?: {
    cart?: StoreCartResponse;
  };
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const cartTokenStorageKey = "wc_cart_token";
const cartNonceStorageKey = "wc_cart_nonce";

function getStoredCartToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.sessionStorage.getItem(cartTokenStorageKey) || "";
}

function getStoredCartNonce() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.sessionStorage.getItem(cartNonceStorageKey) || "";
}

export function getStoredCartRequestHeaders() {
  const headers: Record<string, string> = {};
  const cartToken = getStoredCartToken();
  const nonce = getStoredCartNonce();

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  if (nonce) {
    headers.Nonce = nonce;
  }

  return headers;
}

function persistCartTokenFromResponse(response: Response) {
  if (typeof window === "undefined") {
    return;
  }

  const nextToken = response.headers.get("cart-token");
  if (nextToken) {
    window.sessionStorage.setItem(cartTokenStorageKey, nextToken);
  }

  const nextNonce = response.headers.get("nonce");
  if (nextNonce) {
    window.sessionStorage.setItem(cartNonceStorageKey, nextNonce);
  }
}

async function fetchCart(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const storedCartToken = getStoredCartToken();

  if (storedCartToken) {
    headers.set("Cart-Token", storedCartToken);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  persistCartTokenFromResponse(response);
  return response;
}

function parseStoreCart(response: StoreCartResponse): CartItem[] {
  const items = response.items ?? [];

  return items.map((item, index) => {
    return {
      id: item.key || `${item.id || index}`,
      product: {
        id: String(item.id || index),
        name: item.name,
        category: "WooCommerce",
        katakana: "",
        price: Number(item.prices?.price || 0) / Math.pow(10, item.prices?.currency_minor_unit ?? 2),
        image: item.images?.[0]?.src || "/placeholder.svg",
        blurb: "",
      },
      quantity: item.quantity || 1,
      size: item.variation?.find((variation) => variation.attribute?.toLowerCase() === "size")?.value || "M",
    };
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const applyConflictCart = async (response: Response) => {
    if (response.status !== 409) {
      return false;
    }

    try {
      const errorResponse = (await response.clone().json()) as StoreCartErrorResponse;
      if (errorResponse.data?.cart) {
        setItems(parseStoreCart(errorResponse.data.cart));
        return true;
      }
    } catch {
      // Ignore malformed conflict payloads.
    }

    return false;
  };

  const refreshCart = async () => {
    try {
      const response = await fetchCart("/api/cart", {
        cache: "no-store",
      });

      if (!response.ok) {
        setItems([]);
        return;
      }

      const cart = await response.json();
      setItems(parseStoreCart(cart));
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    void refreshCart();
  }, []);

  const addItem = async (product: Product, size = "M", quantity = 1) => {
    try {
      setIsLoading(true);
      const response = await fetchCart("/api/cart/add-item", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(product.id),
          quantity: Math.max(1, quantity),
          variation: size ? [{ attribute: "size", value: size }] : undefined,
        }),
      });

      if (response.ok) {
        await refreshCart();
      } else {
        await applyConflictCart(response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, delta: number) => {
    if (delta === 0) {
      return;
    }

    try {
      setIsLoading(true);
      const currentItem = items.find((item) => item.id === itemId);
      if (!currentItem) {
        return;
      }

      const nextQuantity = Math.max(0, currentItem.quantity + delta);
      const response = await fetchCart("/api/cart/update-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: itemId,
          quantity: nextQuantity,
        }),
      });

      if (response.ok) {
        await refreshCart();
      } else {
        await applyConflictCart(response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      const response = await fetchCart(`/api/cart/items/${encodeURIComponent(itemId)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await refreshCart();
      } else {
        await applyConflictCart(response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetchCart("/api/cart/items", {
        method: "DELETE",
      });

      if (response.ok) {
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      cartCount,
      isLoading,
    }),
    [items, cartCount, isLoading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    // Return a safe default instead of throwing to prevent crashes
    console.error("useCart must be used within a CartProvider");
    return {
      items: [],
      addItem: async () => {},
      updateQuantity: async () => {},
      removeItem: async () => {},
      clearCart: async () => {},
      cartCount: 0,
      isLoading: false,
    };
  }

  return context;
}
