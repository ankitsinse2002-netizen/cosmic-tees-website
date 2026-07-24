import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let api: WooCommerceRestApi | null = null;

function normalizeWooBaseUrl(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) {
    return undefined;
  }

  const wpJsonIndex = normalized.toLowerCase().indexOf("/wp-json");
  const withoutApiPath = wpJsonIndex >= 0
    ? normalized.slice(0, wpJsonIndex)
    : normalized;

  return withoutApiPath.replace(/\/+$/, "") || undefined;
}

export function getWooBaseUrl() {
  return normalizeWooBaseUrl(process.env.WC_API_URL) ?? normalizeWooBaseUrl(process.env.NEXT_PUBLIC_WC_URL);
}

export function getWooConfig() {
  const url = getWooBaseUrl();
  const consumerKey = process.env.WC_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.WC_CONSUMER_SECRET?.trim();

  return {
    url,
    consumerKey,
    consumerSecret,
  };
}

export function isWooConfigured() {
  const { url, consumerKey, consumerSecret } = getWooConfig();
  return Boolean(url && consumerKey && consumerSecret);
}

export function assertWooConfigured() {
  const { url, consumerKey, consumerSecret } = getWooConfig();

  if (!url || !consumerKey || !consumerSecret) {
    throw new Error(
      "WooCommerce is not configured. Set WC_API_URL (or NEXT_PUBLIC_WC_URL), WC_CONSUMER_KEY, and WC_CONSUMER_SECRET.",
    );
  }

  return { url, consumerKey, consumerSecret };
}

function getApi() {
  if (!isWooConfigured()) {
    return null;
  }

  if (!api) {
    const { url, consumerKey, consumerSecret } = assertWooConfigured();

    api = new WooCommerceRestApi({
      url,
      consumerKey,
      consumerSecret,
      version: "wc/v3",
      queryStringAuth: true,
    });
  }

  return api;
}

export default getApi;
