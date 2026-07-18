import { NextRequest, NextResponse } from 'next/server';

const BASE_WOO_URL = 'https://cosmictees.co.in/wp-json/wc/store/v1/cart';

function getSetCookieValues(headers: Headers): string[] {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  const setCookie = headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

async function proxyCartRequest(request: NextRequest) {
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

    const finalWooUrl = `${BASE_WOO_URL}${wooPath}${wooSearch}`;

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
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) { return proxyCartRequest(request); }
export async function POST(request: NextRequest) { return proxyCartRequest(request); }
export async function PUT(request: NextRequest) { return proxyCartRequest(request); }
export async function DELETE(request: NextRequest) { return proxyCartRequest(request); }