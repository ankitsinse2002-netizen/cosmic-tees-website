import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let api: WooCommerceRestApi | null = null;

function getApi() {
  if (!api) {
    const url = process.env.NEXT_PUBLIC_WC_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!url || !consumerKey || !consumerSecret) {
      throw new Error(
        "WooCommerce environment variables are not configured. " +
        "Please set NEXT_PUBLIC_WC_URL, WC_CONSUMER_KEY, and WC_CONSUMER_SECRET."
      );
    }

    api = new WooCommerceRestApi({
      url,
      consumerKey,
      consumerSecret,
      version: "wc/v3",
    });
  }

  return api;
}

export default getApi;
