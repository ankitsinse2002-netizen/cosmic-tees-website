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
