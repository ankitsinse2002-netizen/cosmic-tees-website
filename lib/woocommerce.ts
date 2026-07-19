import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let api: WooCommerceRestApi | null = null;
let initAttempted = false;
let hasValidConfig = false;

function getApi() {
  if (!initAttempted) {
    initAttempted = true;
    const url = process.env.NEXT_PUBLIC_WC_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (url && consumerKey && consumerSecret) {
      hasValidConfig = true;
      api = new WooCommerceRestApi({
        url,
        consumerKey,
        consumerSecret,
        version: "wc/v3",
      });
    }
  }

  return api;
}

export function isWooCommerceConfigured(): boolean {
  // Trigger initialization if not done
  getApi();
  return hasValidConfig;
}

export default getApi;
