import getApi, { isWooCommerceConfigured } from "./woocommerce";
import { mapWooProduct } from "./mapper";

export async function getProducts() {
  try {
    if (!isWooCommerceConfigured()) {
      return [];
    }
    
    const api = getApi();
    if (!api) {
      return [];
    }
    
    const response = await api.get("products", {
      per_page: 100,
      status: "publish",
    });

    return response.data.map(mapWooProduct);
  } catch (error) {
    console.error("WooCommerce Error:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    if (!isWooCommerceConfigured()) {
      return [];
    }
    
    const api = getApi();
    if (!api) {
      return [];
    }
    
    const response = await api.get("products", {
      featured: true,
      per_page: 8,
    });

    return response.data.map(mapWooProduct);
  } catch (error) {
    console.error("Featured Products Error:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    if (!isWooCommerceConfigured()) {
      return null;
    }
    
    const api = getApi();
    if (!api) {
      return null;
    }
    
    const response = await api.get("products", {
      slug,
    });

    if (!response.data.length) {
      return null;
    }

    return mapWooProduct(response.data[0]);
  } catch (error) {
    console.error("Product Error:", error);
    return null;
  }
}
