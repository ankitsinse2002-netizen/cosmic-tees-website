import { formatCurrency } from "./format-currency";

export { formatCurrency };

export type SuccessOrderMeta = {
  orderId: string;
  paymentStatus: string;
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: string;
  email: string;
  phone: string;
};

export type SuccessOrderItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
};

export type SuccessTotals = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

export type SuccessPageData = {
  meta: SuccessOrderMeta;
  items: SuccessOrderItem[];
  totals: SuccessTotals;
};

function getPlaceholderItems(): SuccessOrderItem[] {
  return [
    {
      id: "placeholder-1",
      name: "Cosmic Eclipse Tee",
      image: "/product-cosmic-eclipse.png",
      size: "M",
      quantity: 1,
      price: 749,
    },
    {
      id: "placeholder-2",
      name: "Neo Tokyo Graphic",
      image: "/product-neo-tokyo.png",
      size: "L",
      quantity: 1,
      price: 799,
    },
  ];
}

function computeTotals(items: SuccessOrderItem[]): SuccessTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const discount = 0;

  return {
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
  };
}

export function getOrderSuccessPlaceholderData(): SuccessPageData {
  const items = getPlaceholderItems();

  return {
    // TODO: Replace placeholder metadata with WooCommerce order payload
    // after order creation + payment verification are implemented.
    meta: {
      orderId: "#CT-2026-0717",
      paymentStatus: "Paid (Placeholder)",
      orderDate: "17 Jul 2026",
      estimatedDelivery: "22-25 Jul 2026",
      shippingAddress: "201 Skyline Avenue, Bandra West, Mumbai, Maharashtra 400050, India",
      email: "customer@example.com",
      phone: "+91 98765 43210",
    },
    items,
    totals: computeTotals(items),
  };
}
