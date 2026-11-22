/**
 * The catalogue fingerprint: a SHA-256 hash of the Storefront data a build reads (src/lib/catalog.ts), in a canonical
 * form, so it changes when the catalogue does and only then. The build writes the hash of the data it used to
 * catalog-hash.txt (src/app/catalog-hash.txt/route.ts). The hourly catalogue check (.github/workflows/catalog-check.yml)
 * reads the store the same way (scripts/catalog-hash.mjs) and starts a deploy when the two differ.
 *
 * What is hashed:
 *   - every product of the catalogue request (PRODUCTS_QUERY in queries.ts) with every field the build reads: id,
 *     handle, title, description, product type, vendor, tags, availability, featured image, images (URL, alt text, size),
 *     price range, options and their values, and variants (id, title, SKU, availability, price, selected options, image);
 *   - each listing collection the build reads (COLLECTION_HANDLES_QUERY): its handle, title and member handles, or the
 *     fact that it doesn't exist.
 * Canonical form:
 *   - products, collections, a collection's members and a product's tags are sorted: the site doesn't depend on the
 *     order Shopify lists them in (listing pages sort by rank, tags are read as a set);
 *   - images, variants, options and option values keep Shopify's order: they are the gallery order, the default variant
 *     and the order of the choices on the product page, so reordering them is a real change;
 *   - object keys are sorted, and strings compare by code unit, so the hash doesn't depend on the machine's locale.
 * Left out: everything outside the response's data (the API's cost and throttle figures, which vary per request), and
 * the browser's own reads (the bag, a stone's live availability), which aren't built into the pages.
 */
import type { ShopifyCollectionMembers, ShopifyProduct } from "./types";

/** The Storefront data a build reads: the catalogue request's products, and each listing collection (null: none). */
export type CatalogSnapshot = {
  products: ShopifyProduct[];
  collections: Array<{ handle: string; collection: ShopifyCollectionMembers | null }>;
};

const byCodeUnit = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** The snapshot in canonical form: what the hash is computed from. */
export function canonicalCatalog(snapshot: CatalogSnapshot) {
  return {
    products: snapshot.products
      .map((product) => ({ ...product, tags: [...product.tags].sort(byCodeUnit) }))
      .sort((a, b) => byCodeUnit(a.handle, b.handle)),
    collections: snapshot.collections
      .map(({ handle, collection }) => ({ handle, collection: collection && { ...collection, products: [...collection.products].sort(byCodeUnit) } }))
      .sort((a, b) => byCodeUnit(a.handle, b.handle)),
  };
}

/** JSON with object keys sorted at every level; arrays keep their order. */
export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => byCodeUnit(a, b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** The fingerprint: 64 lowercase hex characters. Web Crypto, so it runs in Node scripts and the Next build alike. */
export async function catalogHash(snapshot: CatalogSnapshot): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(stableJson(canonicalCatalog(snapshot))));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
