import getApi from "./woocommerce";
import { mapWooProduct } from "./mapper";
import {
  getMockFeaturedProducts,
  getMockProductBySlug,
  getMockProducts,
} from "./mock-products";

export async function getProducts() {
  try {
    const api = getApi();
    if (!api) {
      return getMockProducts();
    }

    const response = await api.get("products", {
      per_page: 100,
      status: "publish",
    });

    return response.data.map(mapWooProduct);
  } catch (error) {
    console.error("WooCommerce Error:", error);
    return getMockProducts();
  }
}

export async function getFeaturedProducts() {
  try {
    const api = getApi();
    if (!api) {
      return getMockFeaturedProducts();
    }

    const response = await api.get("products", {
      featured: true,
      per_page: 8,
    });

    return response.data.map(mapWooProduct);
  } catch (error) {
    console.error("Featured Products Error:", error);
    return getMockFeaturedProducts();
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const api = getApi();
    if (!api) {
      return getMockProductBySlug(slug);
    }

    const response = await api.get("products", {
      slug,
    });

    if (!response.data.length) {
      return getMockProductBySlug(slug);
    }

    return mapWooProduct(response.data[0]);
  } catch (error) {
    console.error("Product Error:", error);
    return getMockProductBySlug(slug);
  }
}
