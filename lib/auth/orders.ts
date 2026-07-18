import api from "@/lib/woocommerce";

export type AccountOrder = {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
  dateCreated: string;
};

export async function getOrdersByEmail(email: string): Promise<AccountOrder[]> {
  try {
    const response = await api.get("orders", {
      email,
      per_page: 20,
      orderby: "date",
      order: "desc",
    });

    const data = response.data as Array<{
      id: number;
      number?: string;
      status?: string;
      total?: string;
      currency?: string;
      date_created?: string;
    }>;

    return data.map((order) => ({
      id: order.id,
      number: String(order.number || order.id),
      status: order.status || "pending",
      total: order.total || "0",
      currency: order.currency || "INR",
      dateCreated: order.date_created || "",
    }));
  } catch (error) {
    console.error("[auth/orders] Failed to fetch WooCommerce orders:", error);
    return [];
  }
}
