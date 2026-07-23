import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let api: WooCommerceRestApi | null = null;

export function getWooConfig() {
  const url = process.env.NEXT_PUBLIC_WC_URL?.trim();
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

function getApi() {
  if (!isWooConfigured()) {
    return null;
  }

  if (!api) {
    const { url, consumerKey, consumerSecret } = getWooConfig();

    api = new WooCommerceRestApi({
      url: url!,
      consumerKey: consumerKey!,
      consumerSecret: consumerSecret!,
      version: "wc/v3",
    });
  }

  return api;
}

export default getApi;
