/**
 * Build-time product catalogue. Reads from Shopify; falls back to the mock catalogue only when Shopify isn't
 * configured, can't be reached, or returns nothing, and says so in the build log. The site never breaks
 * because the store is unavailable.
 */
import type { Product } from "@/content/products";
import { getCollectionProductHandles, getProducts, shopifyConfig, type ShopifyProduct } from "@/lib/shopify";
import { mapShopifyProduct } from "@/lib/shopify/mapProduct";
import { getMockProducts } from "./mockCatalog";

/** `raw`: the Storefront API products as fetched (empty for the mock catalogue); the ring builder reads its stones from them. */
export type Catalog = { products: Product[]; source: "shopify" | "mock"; raw: ShopifyProduct[] };

let catalog: Promise<Catalog> | undefined;

function fallback(reason: string): Catalog {
  console.warn(
    `\n[catalog] WARNING: using the mock catalogue from src/content/catalog-seed.ts, because ${reason}.\n` +
      "[catalog] Check NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN, and that the products are available to the Headless channel.\n",
  );
  return { products: getMockProducts(), source: "mock", raw: [] };
}

async function loadCatalog(): Promise<Catalog> {
  if (!shopifyConfig()) return fallback("Shopify is not configured");
  try {
    const raw = await getProducts({ first: 250 });
    const products = raw.map(mapShopifyProduct).filter((product): product is Product => product !== null);
    if (!products.length) return fallback("Shopify returned no products");
    console.info(`[catalog] ${products.length} products from Shopify.`);
    return { products, source: "shopify", raw };
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

const byRank = (a: Product, b: Product) => a.rank - b.rank || a.name.localeCompare(b.name);

/**
 * Products for a listing page, in "Best Match" order. Uses the Shopify collection with the category's handle
 * (e.g. "rings") when it exists; otherwise, and for the mock catalogue, the products whose type matches.
 */
export async function getCategoryProducts(category: string): Promise<{ products: Product[]; from: "collection" | "product type" }> {
  const { products, source } = await getCatalog();
  if (source === "shopify") {
    try {
      const handles = await getCollectionProductHandles(category);
      if (handles?.length) {
        const inCollection = products.filter((product) => handles.includes(product.slug)).sort(byRank);
        console.info(`[catalog] ${category}: ${inCollection.length} products from the "${category}" collection.`);
        return { products: inCollection, from: "collection" };
      }
    } catch (error) {
      console.warn(`[catalog] ${category}: collection lookup failed (${error instanceof Error ? error.message : String(error)}).`);
    }
  }
  const ofType = products.filter((product) => product.category === category).sort(byRank);
  if (!ofType.length && source === "shopify") {
    console.warn(
      `[catalog] WARNING: ${category}: Shopify has no products of this type yet, so this page uses the mock catalogue. Import shopify/products-seed.csv to fix it.`,
    );
    return { products: getMockProducts().filter((product) => product.category === category).sort(byRank), from: "product type" };
  }
  console.info(`[catalog] ${category}: ${ofType.length} products by product type${source === "shopify" ? ' (no "' + category + '" collection yet)' : ""}.`);
  return { products: ofType, from: "product type" };
}
