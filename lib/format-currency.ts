/**
 * Formats a numeric value as Indian Rupees (₹).
 * Used consistently across cart, checkout, product detail, payment and order-success.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
