/**
 * The fallback catalogue: src/content/catalog-seed.ts shaped exactly like the Storefront API returns the
 * imported CSV, then run through the same mapper as real Shopify data. So the site looks the same before
 * and after the import; only the variant ids (needed for the cart) are missing.
 */
import { caratLabel, expandSeed, seedProducts, seedRanks, type SeedProduct } from "@/content/catalog-seed";
import { metalById } from "@/content/metals";
import type { Product } from "@/content/products";
import { mapShopifyProduct } from "./shopify/mapProduct";
import type { ShopifyProduct } from "./shopify/types";

const usd = (amount: number) => ({ amount: amount.toFixed(1), currencyCode: "USD" });
const imageUrl = (photo: string) => `${photo}.jpg`;

/** A seed product as the Storefront API would return it once imported. Also used for the builder's settings (src/lib/builder.ts). */
export function seedToShopify(seed: SeedProduct, rank: number): ShopifyProduct {
  const expanded = expandSeed(seed, (id) => metalById(id).label, rank);
  const { variants } = expanded;
  const hasCarat = variants.some((variant) => variant.carat !== null);
  const images = expanded.images.map(({ photo, alt }) => ({ url: imageUrl(photo), altText: alt, width: null, height: null }));

  return {
    id: "",
    handle: seed.handle,
    title: expanded.title,
    description: seed.description,
    productType: seed.type,
    vendor: "Sky Jewelry",
    tags: expanded.tags,
    availableForSale: true,
    featuredImage: images[0] ?? null,
    images: { nodes: images },
    priceRange: { minVariantPrice: usd(Math.min(...variants.map((variant) => variant.price))) },
    options: [],
    variants: {
      nodes: variants.map((variant) => ({
        id: "",
        title: "",
        sku: variant.sku,
        availableForSale: true,
        price: usd(variant.price),
        selectedOptions: [
          { name: "Metal", value: metalById(variant.metal).label },
          ...(hasCarat && variant.carat !== null ? [{ name: "Carat Weight", value: caratLabel(variant.carat) }] : []),
        ],
        image: { url: imageUrl(variant.photo) },
      })),
    },
  };
}

const toShopifyShape = (seedIndex: number, rank: number) => seedToShopify(seedProducts[seedIndex], rank);

let cached: Product[] | undefined;

export function getMockProducts() {
  const ranks = seedRanks();
  cached ??= seedProducts.map((_, index) => mapShopifyProduct(toShopifyShape(index, ranks[index]))).filter((product): product is Product => product !== null);
  return cached;
}
