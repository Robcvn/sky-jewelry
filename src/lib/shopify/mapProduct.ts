import { roseGold, whiteGold, type Metal, type Product } from "@/content/products";
import type { ShopifyProduct } from "./types";

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const METALS: Metal[] = ["white-gold", "yellow-gold", "rose-gold"];

/** The metal from the "Metal" option of the first variant, or a metal tag such as "rose-gold". */
function metalOf(product: ShopifyProduct): Metal {
  const option = product.variants.nodes[0]?.selectedOptions.find((selected) => selected.name.toLowerCase() === "metal");
  const fromOption = option ? (slugify(option.value) as Metal) : undefined;
  if (fromOption && METALS.includes(fromOption)) return fromOption;
  const fromTag = product.tags.map(slugify).find((tag): tag is Metal => METALS.includes(tag as Metal));
  return fromTag ?? "white-gold";
}

/**
 * Maps a Storefront API product to the Product type the components already use.
 * Name, handle, description, price, type and metal come from Shopify. The photo is the site's own optimised
 * WebP crop for that metal (Picture serves pre-sized local files); Shopify's image URL is not used yet.
 * Yellow gold has no crop yet, so it shows the white gold photo.
 */
export function mapShopifyProduct(product: ShopifyProduct): Product | null {
  const price = Number(product.priceRange.minVariantPrice.amount);
  if (!product.handle || !product.title || !Number.isFinite(price)) return null;
  const metal = metalOf(product);
  const alt = product.featuredImage?.altText || product.title;

  return {
    _id: product.handle,
    _type: "product",
    name: product.title,
    slug: product.handle,
    category: slugify(product.productType) || "products",
    description: product.description,
    priceFrom: price,
    metal,
    image: metal === "rose-gold" ? roseGold(alt) : whiteGold(alt),
  };
}
