// NOTE: Static catalog for now. When integrating WooCommerce, replace this
// array with data fetched from the WooCommerce Store API (products endpoint)
// and map each product's id, name, categories, price, sale_price, images, and
// short_description onto this same Product shape so the UI keeps working.
export type Product = {
  id: string
  name: string

  // WooCommerce
  slug?: string
  sku?: string

  category: string
  katakana: string

  price: number
  compareAt?: number

  tag?: string

  image: string
  gallery?: {
    id?: number
    src: string
    alt?: string
  }[]

  blurb: string
  description?: string

  stockStatus?: string

  /** Curated for the homepage Featured Collection */
  featured?: boolean

  /** Surfaced in the New Arrivals rail */
  isNew?: boolean

  /** Surfaced in the Best Sellers rail */
  bestseller?: boolean
}

export const products: Product[] = [
  {
    id: 'essential-void',
    name: 'Essential Void Tee',
    category: 'Cosmic',
    katakana: 'エッセンシャル',
    price: 599,
    compareAt: 899,
    tag: 'Entry Drop',
    image: '/product-essential-black.png',
    blurb: '240 GSM super-combed cotton. The foundation of every fit.',
    featured: true,
  },
  {
    id: 'anime-overdrive',
    name: 'Anime Overdrive Graphic',
    category: 'Anime',
    katakana: 'オーバードライブ',
    price: 699,
    compareAt: 1099,
    tag: 'Best Seller',
    image: '/product-anime-graphic.png',
    blurb: 'Deep-ink washable print engineered to never crack.',
    featured: true,
    bestseller: true,
  },
  {
    id: 'acid-wash-limited',
    name: 'Acid Wash Limited',
    category: 'Trending Drops',
    katakana: 'リミテッド',
    price: 999,
    compareAt: 1499,
    tag: 'Limited // 200 Made',
    image: '/product-acid-wash.png',
    blurb: 'Hand-finished acid wash. Boxy dropped-shoulder cut.',
    featured: true,
  },
  {
    id: 'quotes-manifest',
    name: 'Manifest Quote Tee',
    category: 'Quotes',
    katakana: 'マニフェスト',
    price: 699,
    compareAt: 999,
    tag: 'Quotes',
    image: '/product-quotes-tee.png',
    blurb: 'Typographic statement print. Say it without saying it.',
    featured: true,
  },
  {
    id: 'cosmic-eclipse',
    name: 'Cosmic Eclipse Tee',
    category: 'Cosmic',
    katakana: 'エクリプス',
    price: 749,
    compareAt: 1099,
    image: '/product-cosmic-eclipse.png',
    blurb: 'Oversized crimson eclipse print on jet-black heavyweight cotton.',
    isNew: true,
  },
  {
    id: 'neo-tokyo',
    name: 'Neo Tokyo Graphic',
    category: 'Anime',
    katakana: 'ネオトウキョウ',
    price: 799,
    compareAt: 1199,
    image: '/product-neo-tokyo.png',
    blurb: 'Katakana-charged anime print built for the midnight ride.',
    isNew: true,
  },
  {
    id: 'void-rebel',
    name: 'Void Rebel Quote Tee',
    category: 'Quotes',
    katakana: 'レベル',
    price: 649,
    compareAt: 949,
    image: '/product-void-rebel.png',
    blurb: 'Minimal crimson statement type on washed black.',
    isNew: true,
  },
  {
    id: 'glitch-quote',
    name: 'Glitch Manifesto Tee',
    category: 'Quotes',
    katakana: 'グリッチ',
    price: 699,
    compareAt: 1049,
    image: '/product-glitch-quote.png',
    blurb: 'Distorted glitch typography for the terminally online.',
    isNew: true,
  },
  {
    id: 'crimson-oni',
    name: 'Crimson Oni Tee',
    category: 'Anime',
    katakana: 'オニ',
    price: 849,
    compareAt: 1299,
    tag: 'Best Seller',
    image: '/product-crimson-oni.png',
    blurb: 'Red oni demon mask graphic. A cult-favorite drop.',
    bestseller: true,
  },
  {
    id: 'jdm-drift',
    name: 'JDM Drift Tee',
    category: 'Trending Drops',
    katakana: 'ドリフト',
    price: 799,
    compareAt: 1199,
    tag: 'Best Seller',
    image: '/product-jdm-drift.png',
    blurb: 'JDM street-racing graphic in crimson and bone white.',
    bestseller: true,
  },
  {
    id: 'shadow-monk',
    name: 'Shadow Monk Tee',
    category: 'Cosmic',
    katakana: 'モンク',
    price: 899,
    compareAt: 1349,
    tag: 'Best Seller',
    image: '/product-shadow-monk.png',
    blurb: 'Galaxy and crescent-moon print in muted crimson tones.',
    bestseller: true,
  },
  {
    id: 'orbit-wash',
    name: 'Orbit Acid Wash Tee',
    category: 'Trending Drops',
    katakana: 'オービット',
    price: 949,
    compareAt: 1399,
    image: '/product-orbit-wash.png',
    blurb: 'Faded acid-wash body with a subtle orbital ring graphic.',
  },
]

export const featuredProducts = products.filter((p) => p.featured).slice(0, 4)
export const newArrivals = products.filter((p) => p.isNew).slice(0, 4)
export const bestSellers = products.filter((p) => p.bestseller).slice(0, 4)

export const categories = [
  {
    name: 'Anime',
    katakana: 'アニメ',
    image: '/category-anime.png',
    blurb: 'Bold graphic drops',
  },
  {
    name: 'Cosmic',
    katakana: 'コズミック',
    image: '/category-cosmic.png',
    blurb: 'Galaxy & void prints',
  },
  {
    name: 'Quotes',
    katakana: 'クオーツ',
    image: '/category-quotes.png',
    blurb: 'Statement typography',
  },
  {
    name: 'Trending Drops',
    katakana: 'トレンド',
    image: '/category-trending.png',
    blurb: 'Limited & fast-moving',
  },
]
