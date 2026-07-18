import { formatCurrency } from "./format-currency";

export { formatCurrency };

export type ReadonlyAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  country: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
};

export type ReadonlyContact = {
  phone: string;
  email: string;
  orderNotes?: string;
};

export type CheckoutSnapshot = {
  billing: ReadonlyAddress;
  shipping: ReadonlyAddress;
  contact: ReadonlyContact;
};

export type PaymentCartLine = {
  id: string;
  size: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
  };
};

export type PaymentTotals = {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
};

const fallbackAddress: ReadonlyAddress = {
  firstName: "Pending",
  lastName: "Checkout Data",
  company: "",
  country: "India",
  address1: "Will be populated from Checkout",
  address2: "",
  city: "Mumbai",
  state: "Maharashtra",
  postcode: "400001",
};

const fallbackContact: ReadonlyContact = {
  phone: "Will be populated from Checkout",
  email: "checkout@example.com",
  orderNotes: "",
};

function readParam(searchParams: URLSearchParams, key: string, fallback = "") {
  const value = searchParams.get(key);
  return value?.trim() || fallback;
}

function readAddress(searchParams: URLSearchParams, prefix: string): ReadonlyAddress {
  return {
    firstName: readParam(searchParams, `${prefix}_first_name`, fallbackAddress.firstName),
    lastName: readParam(searchParams, `${prefix}_last_name`, fallbackAddress.lastName),
    company: readParam(searchParams, `${prefix}_company`, fallbackAddress.company),
    country: readParam(searchParams, `${prefix}_country`, fallbackAddress.country),
    address1: readParam(searchParams, `${prefix}_address_1`, fallbackAddress.address1),
    address2: readParam(searchParams, `${prefix}_address_2`, fallbackAddress.address2),
    city: readParam(searchParams, `${prefix}_city`, fallbackAddress.city),
    state: readParam(searchParams, `${prefix}_state`, fallbackAddress.state),
    postcode: readParam(searchParams, `${prefix}_postcode`, fallbackAddress.postcode),
  };
}

export function getCheckoutSnapshot(searchParams: URLSearchParams): CheckoutSnapshot {
  const billing = readAddress(searchParams, "billing");

  return {
    billing,
    // Shipping defaults to billing when dedicated fields are not present.
    shipping: {
      firstName: readParam(searchParams, "shipping_first_name", billing.firstName),
      lastName: readParam(searchParams, "shipping_last_name", billing.lastName),
      company: readParam(searchParams, "shipping_company", billing.company),
      country: readParam(searchParams, "shipping_country", billing.country),
      address1: readParam(searchParams, "shipping_address_1", billing.address1),
      address2: readParam(searchParams, "shipping_address_2", billing.address2),
      city: readParam(searchParams, "shipping_city", billing.city),
      state: readParam(searchParams, "shipping_state", billing.state),
      postcode: readParam(searchParams, "shipping_postcode", billing.postcode),
    },
    contact: {
      phone: readParam(searchParams, "billing_phone", fallbackContact.phone),
      email: readParam(searchParams, "billing_email", fallbackContact.email),
      orderNotes: readParam(searchParams, "order_comments", fallbackContact.orderNotes),
    },
  };
}

export function getPaymentTotals(items: PaymentCartLine[]): PaymentTotals {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : subtotal === 0 ? 0 : 120;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return {
    subtotal,
    shipping,
    discount,
    total,
  };
}

export function serializeCheckoutSnapshot(snapshot: CheckoutSnapshot) {
  const params = new URLSearchParams();

  const writeAddress = (prefix: "billing" | "shipping", address: ReadonlyAddress) => {
    params.set(`${prefix}_first_name`, address.firstName);
    params.set(`${prefix}_last_name`, address.lastName);
    if (address.company) params.set(`${prefix}_company`, address.company);
    params.set(`${prefix}_country`, address.country);
    params.set(`${prefix}_address_1`, address.address1);
    if (address.address2) params.set(`${prefix}_address_2`, address.address2);
    params.set(`${prefix}_city`, address.city);
    params.set(`${prefix}_state`, address.state);
    params.set(`${prefix}_postcode`, address.postcode);
  };

  writeAddress("billing", snapshot.billing);
  writeAddress("shipping", snapshot.shipping);

  params.set("billing_phone", snapshot.contact.phone);
  params.set("billing_email", snapshot.contact.email);
  if (snapshot.contact.orderNotes) {
    params.set("order_comments", snapshot.contact.orderNotes);
  }

  return params;
}

export function getCustomerName(snapshot: CheckoutSnapshot) {
  return [snapshot.billing.firstName, snapshot.billing.lastName]
    .filter(Boolean)
    .join(" ")
    .trim() || "Customer Name";
}
