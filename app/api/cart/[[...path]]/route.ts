import { NextRequest, NextResponse } from 'next/server';
import { getMockProducts } from '@/lib/mock-products';

const cartNonce = 'mock-cart-nonce';
const fallbackCarts = new Map<string, Map<string, MockCartItem>>();

type MockCartItem = {
  key: string;
  id: number;
  quantity: number;
  name: string;
  images: Array<{ src: string; alt?: string }>;
  prices: {
    price: string;
    currency_minor_unit: number;
  };
  variation?: Array<{ attribute: string; value: string }>;
};

function isWooConfigured() {
  const url = process.env.NEXT_PUBLIC_WC_URL?.trim();
  const consumerKey = process.env.WC_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.WC_CONSUMER_SECRET?.trim();
  return Boolean(url && consumerKey && consumerSecret);
}

function getWooCartBaseUrl() {
  const baseUrl = (process.env.NEXT_PUBLIC_WC_URL?.trim() || 'https://cosmictees.co.in').replace(/\/$/, '');
  return `${baseUrl}/wp-json/wc/store/v1/cart`;
}

function toMinorUnits(value: number) {
  return String(Math.round(value * 100));
}

function readCartToken(request: NextRequest) {
  return (
    request.headers.get('cart-token') ||
    request.headers.get('x-wc-store-cart-token') ||
    request.cookies.get('mock_cart_token')?.value ||
    crypto.randomUUID()
  );
}

function getOrCreateMockCart(token: string) {
  const existing = fallbackCarts.get(token);
  if (existing) {
    return existing;
  }

  const created = new Map<string, MockCartItem>();
  fallbackCarts.set(token, created);
  return created;
}

function createMockCartResponse(cart: Map<string, MockCartItem>) {
  const items = Array.from(cart.values());
  const subtotal = items.reduce((total, item) => {
    return total + Number(item.prices.price || 0) / 100 * item.quantity;
  }, 0);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 120;

  return {
    items,
    item_count: items.reduce((count, item) => count + item.quantity, 0),
    totals: {
      subtotal: toMinorUnits(subtotal),
      total_shipping: toMinorUnits(shipping),
      total_price: toMinorUnits(subtotal + shipping),
      currency_minor_unit: 2,
    },
  };
}

function withMockHeaders(response: NextResponse, token: string) {
  response.headers.set('Cart-Token', token);
  response.headers.set('Nonce', cartNonce);
  response.cookies.set('mock_cart_token', token, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}

function resolveProductFromMockCatalog(productId: number) {
  return getMockProducts().find((item) => Number(item.id) === productId) ?? null;
}

async function handleMockCartRequest(request: NextRequest) {
  const token = readCartToken(request);
  const cart = getOrCreateMockCart(token);

  const urlObj = new URL(request.url);
  const pathname = urlObj.pathname;
  const subPath = pathname.replace('/api/cart', '');

  if (request.method === 'GET') {
    return withMockHeaders(NextResponse.json(createMockCartResponse(cart)), token);
  }

  if (request.method === 'POST' && subPath === '/add-item') {
    const body = (await request.json().catch(() => ({}))) as {
      id?: number;
      quantity?: number;
      variation?: Array<{ attribute?: string; value?: string }>;
    };

    const productId = Number(body.id || 0);
    if (!Number.isFinite(productId) || productId <= 0) {
      return withMockHeaders(NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 }), token);
    }

    const quantity = Math.max(1, Number(body.quantity || 1));
    const size = body.variation?.find((entry) => entry.attribute?.toLowerCase() === 'size')?.value || 'M';
    const key = `${productId}:${size}`;
    const product = resolveProductFromMockCatalog(productId);

    if (!product) {
      return withMockHeaders(NextResponse.json({ message: 'Product not found.' }, { status: 404 }), token);
    }

    const existing = cart.get(key);
    const priceMinor = toMinorUnits(product.price);
    cart.set(key, {
      key,
      id: productId,
      quantity: (existing?.quantity || 0) + quantity,
      name: product.name,
      images: [{ src: product.image, alt: product.name }],
      prices: {
        price: priceMinor,
        currency_minor_unit: 2,
      },
      variation: [{ attribute: 'size', value: size }],
    });

    return withMockHeaders(NextResponse.json(createMockCartResponse(cart)), token);
  }

  if (request.method === 'POST' && subPath === '/update-item') {
    const body = (await request.json().catch(() => ({}))) as {
      key?: string;
      quantity?: number;
    };

    const key = String(body.key || '');
    const quantity = Number(body.quantity ?? 0);

    if (!key || !cart.has(key)) {
      return withMockHeaders(NextResponse.json(createMockCartResponse(cart)), token);
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      cart.delete(key);
    } else {
      const current = cart.get(key)!;
      cart.set(key, {
        ...current,
        quantity,
      });
    }

    return withMockHeaders(NextResponse.json(createMockCartResponse(cart)), token);
  }

  if (request.method === 'DELETE' && subPath.startsWith('/items/')) {
    const key = decodeURIComponent(subPath.slice('/items/'.length));
    cart.delete(key);
    return withMockHeaders(NextResponse.json(createMockCartResponse(cart)), token);
  }

  if (request.method === 'DELETE' && subPath === '/items') {
    cart.clear();
    return withMockHeaders(NextResponse.json(createMockCartResponse(cart)), token);
  }

  return withMockHeaders(
    NextResponse.json({ message: 'Unsupported cart operation in mock mode.' }, { status: 400 }),
    token,
  );
}

function getSetCookieValues(headers: Headers): string[] {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  const setCookie = headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

async function proxyCartRequest(request: NextRequest) {
  if (!isWooConfigured()) {
    return handleMockCartRequest(request);
  }

  try {
    const urlObj = new URL(request.url);
    const pathname = urlObj.pathname;
    const subPath = pathname.replace('/api/cart', '');
    let wooPath = subPath;
    let wooSearch = urlObj.search;
    let wooMethod = request.method;

    const incomingCookies = request.headers.get('cookie') || '';
    const cartToken = request.headers.get('cart-token') || request.headers.get('x-wc-store-cart-token') || '';
    const nonce = request.headers.get('nonce') || request.headers.get('x-wp-nonce') || '';
    const contentType = request.headers.get('content-type') || '';
    const requestBodyText = request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : '';

    if (request.method === 'DELETE' && subPath.startsWith('/items/')) {
      console.log('[cart-proxy] incoming browser request', {
        url: request.url,
        cookie: request.headers.get('cookie') || '',
        cartToken: request.headers.get('cart-token') || request.headers.get('x-wc-store-cart-token') || '',
        nonce: request.headers.get('nonce') || request.headers.get('x-wp-nonce') || '',
      });
    }

    if (request.method === 'DELETE' && subPath.startsWith('/items/')) {
      const cartItemKey = subPath.slice('/items/'.length);
      wooPath = '/remove-item';
      wooSearch = `?key=${encodeURIComponent(cartItemKey)}`;
      wooMethod = 'POST';
    }

    if (request.method === 'POST' && subPath === '/update-item') {
      if (requestBodyText) {
        try {
          const body = JSON.parse(requestBodyText) as { key?: string; quantity?: number };
          if (body.key) {
            const params = new URLSearchParams();
            params.set('key', body.key);
            if (typeof body.quantity === 'number') {
              params.set('quantity', String(body.quantity));
            }
            wooSearch = `?${params.toString()}`;
          }
        } catch {
          // Keep the original request body if parsing fails.
        }
      }
    }

    const finalWooUrl = `${getWooCartBaseUrl()}${wooPath}${wooSearch}`;

    const headers = new Headers();
    if (contentType) headers.set('Content-Type', contentType);
    if (incomingCookies) headers.set('Cookie', incomingCookies);
    headers.set('Accept', 'application/json');

    if (cartToken) headers.set('Cart-Token', cartToken);
    if (nonce) headers.set('Nonce', nonce);

    if (request.method === 'DELETE' && subPath.startsWith('/items/')) {
      console.log('[cart-proxy] forwarded woo request', {
        url: finalWooUrl,
        headers: {
          cookie: headers.get('cookie') || '',
          'Cart-Token': headers.get('Cart-Token') || '',
          Nonce: headers.get('Nonce') || '',
        },
      });
    }

    const fetchOptions: RequestInit = {
      method: wooMethod,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD' && !(request.method === 'DELETE' && subPath.startsWith('/items/')) && !(request.method === 'POST' && subPath === '/update-item')) {
      if (requestBodyText) {
        fetchOptions.body = requestBodyText;
      }
    }

    const wooResponse = await fetch(finalWooUrl, {
      ...fetchOptions,
      cache: 'no-store',
    });
    const body = await wooResponse.text();
    const responseContentType = wooResponse.headers.get('content-type') || 'application/json';

    const response = new NextResponse(body || null, {
      status: wooResponse.status,
      headers: {
        'content-type': responseContentType,
      },
    });

    for (const cookieValue of getSetCookieValues(wooResponse.headers)) {
      response.headers.append('Set-Cookie', cookieValue);
    }

    const newCartToken = wooResponse.headers.get('cart-token');
    if (newCartToken) {
      response.headers.set('Cart-Token', newCartToken);
    }

    const newNonce = wooResponse.headers.get('nonce');
    if (newNonce) {
      response.headers.set('Nonce', newNonce);
    }

    return response;
  } catch {
    return handleMockCartRequest(request);
  }
}

export async function GET(request: NextRequest) { return proxyCartRequest(request); }
export async function POST(request: NextRequest) { return proxyCartRequest(request); }
export async function PUT(request: NextRequest) { return proxyCartRequest(request); }
export async function DELETE(request: NextRequest) { return proxyCartRequest(request); }