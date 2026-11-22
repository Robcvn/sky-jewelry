/**
 * Build-time product catalogue. Reads from Shopify; falls back to the mock catalogue only when Shopify isn't
 * configured, can't be reached, or returns nothing, and says so in the build log. The site never breaks
 * because the store is unavailable. One thing does stop the build: a catalogue request that comes back full
 * (CATALOG_PAGE items), since the store may hold more than one request reads and the site would deploy with
 * products silently missing.
 */
import { FINE_JEWELRY_CATEGORIES, type Product } from "@/content/products";
import { getCollectionMembers, getProducts, shopifyConfig, type ShopifyCollectionMembers, type ShopifyProduct } from "@/lib/shopify";
import { catalogHash, type CatalogSnapshot } from "@/lib/shopify/fingerprint";
import { mapShopifyProduct } from "@/lib/shopify/mapProduct";
import { getMockProducts } from "./mockCatalog";

/** `raw`: the Storefront API products as fetched (empty for the mock catalogue); the ring builder reads its stones from them. */
export type Catalog = { products: Product[]; source: "shopify" | "mock"; raw: ShopifyProduct[] };

let catalog: Promise<Catalog> | undefined;

/** The most products (or collection members) one catalogue request reads: the Storefront API's page limit. */
export const CATALOG_PAGE = 250;

/** Thrown when a catalogue request returns a full page. Never caught into the mock fallback: the build stops. */
export class CatalogLimitError extends Error {
  constructor(what: string, count: number) {
    super(
      `[catalog] ERROR: ${what} returned ${count} items, the most one request reads (${CATALOG_PAGE}), so the catalogue may be ` +
        "truncated. Page through the results (src/lib/shopify/index.ts) before the store grows past this; the build stops so " +
        "an incomplete catalogue can't deploy.",
    );
    this.name = "CatalogLimitError";
  }
}

function checkPage(what: string, count: number) {
  if (count >= CATALOG_PAGE) throw new CatalogLimitError(what, count);
}

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
    const raw = await getProducts({ first: CATALOG_PAGE });
    checkPage("The Shopify products request", raw.length);
    const products = raw.map(mapShopifyProduct).filter((product): product is Product => product !== null);
    if (!products.length) return fallback("Shopify returned no products");
    console.info(`[catalog] ${products.length} products from Shopify.`);
    return { products, source: "shopify", raw };
  } catch (error) {
    if (error instanceof CatalogLimitError) throw error;
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

const collectionReads = new Map<string, Promise<ShopifyCollectionMembers | null>>();

/** A listing collection, read once per build worker like the catalogue, so every page and the hash file share it. */
function collectionMembers(handle: string) {
  let read = collectionReads.get(handle);
  if (!read) {
    read = getCollectionMembers(handle, CATALOG_PAGE);
    collectionReads.set(handle, read);
  }
  return read;
}

/**
 * Products for a listing page, in "Best Match" order. Uses the Shopify collection with the category's handle
 * (e.g. "rings") when it exists; otherwise, and for the mock catalogue, the products whose type matches.
 */
export async function getCategoryProducts(category: string): Promise<{ products: Product[]; from: "collection" | "product type" }> {
  const { products, source } = await getCatalog();
  if (source === "shopify") {
    try {
      const handles = (await collectionMembers(category))?.products ?? null;
      checkPage(`The "${category}" collection request`, handles?.length ?? 0);
      if (handles?.length) {
        const inCollection = products.filter((product) => handles.includes(product.slug)).sort(byRank);
        console.info(`[catalog] ${category}: ${inCollection.length} products from the "${category}" collection.`);
        return { products: inCollection, from: "collection" };
      }
    } catch (error) {
      if (error instanceof CatalogLimitError) throw error;
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

/* ---------- The catalogue fingerprint (src/lib/shopify/fingerprint.ts) ---------- */

/**
 * The fingerprint of the Shopify data this build used: the catalogue request's products and the listing collections,
 * from the same reads its pages got. A reason instead when the build didn't read all of it from Shopify (the mock
 * catalogue, or a collection read that failed); the deploy's catalogue check stops such a build anyway.
 */
export async function getCatalogHash(): Promise<{ hash: string } | { reason: string }> {
  const { source, raw } = await getCatalog();
  if (source !== "shopify") return { reason: "this build used the mock catalogue" };
  try {
    const collections = await Promise.all(FINE_JEWELRY_CATEGORIES.map(async (handle) => ({ handle, collection: await collectionMembers(handle) })));
    return { hash: await catalogHash({ products: raw, collections }) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Worded for the deploy's catalogue check ("collection lookup failed"), so this build doesn't go live.
    console.warn(`[catalog] catalog-hash.txt: collection lookup failed (${message}).`);
    return { reason: `a collection read failed (${message})` };
  }
}

/**
 * The Storefront data a build reads, with the same requests, straight from the store and with no fallback: whatever
 * would make a build fall back to the mock catalogue or stop throws instead. For scripts/catalog-hash.mjs.
 */
export async function readCatalogFromStore(): Promise<CatalogSnapshot> {
  if (!shopifyConfig()) throw new Error("Shopify is not configured (NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN)");
  const products = await getProducts({ first: CATALOG_PAGE });
  checkPage("The Shopify products request", products.length);
  if (!products.some((product) => mapShopifyProduct(product) !== null)) throw new Error("Shopify returned no products the site can list");
  const collections = await Promise.all(
    FINE_JEWELRY_CATEGORIES.map(async (handle) => {
      const collection = await getCollectionMembers(handle, CATALOG_PAGE);
      checkPage(`The "${handle}" collection request`, collection?.products.length ?? 0);
      return { handle, collection };
    }),
  );
  return { products, collections };
}
