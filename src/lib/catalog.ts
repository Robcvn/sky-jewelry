/**
 * Build-time product catalogue. Reads from Shopify; falls back to the mock products only when Shopify isn't
 * configured, can't be reached, or returns nothing, and says so in the build log. The site never breaks
 * because the store is unavailable.
 */
import { mockProducts, type Product } from "@/content/products";
import { getProducts, shopifyConfig } from "@/lib/shopify";
import { mapShopifyProduct } from "@/lib/shopify/mapProduct";

export type Catalog = { products: Product[]; source: "shopify" | "mock" };

let catalog: Promise<Catalog> | undefined;

function fallback(reason: string): Catalog {
  console.warn(
    `\n[catalog] WARNING: using the mock products from src/content/products.ts, because ${reason}.\n` +
      "[catalog] Check NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN, and that the products are available to the Headless channel.\n",
  );
  return { products: mockProducts, source: "mock" };
}

async function loadCatalog(): Promise<Catalog> {
  if (!shopifyConfig()) return fallback("Shopify is not configured");
  try {
    const products = (await getProducts()).map(mapShopifyProduct).filter((product): product is Product => product !== null);
    if (!products.length) return fallback("Shopify returned no products");
    console.info(`[catalog] ${products.length} products from Shopify.`);
    return { products, source: "shopify" };
  } catch (error) {
    return fallback(`Shopify failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** One request per build: every page shares the same catalogue. */
export function getCatalog() {
  catalog ??= loadCatalog();
  return catalog;
}

/** Looks products up by Shopify handle (the mock ids are the same handles). Missing ones are skipped with a warning. */
export function pickProducts(products: Product[], handles: string[]) {
  return handles.flatMap((handle) => {
    const product = products.find((item) => item._id === handle);
    if (!product) console.warn(`[catalog] No product with handle "${handle}"; it is left out.`);
    return product ? [product] : [];
  });
}
