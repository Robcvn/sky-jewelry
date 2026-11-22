// Prints the fingerprint of the Shopify catalogue the site is built from (src/lib/shopify/fingerprint.ts): the same
// Storefront requests a build makes (readCatalogFromStore in src/lib/catalog.ts), hashed the same way, so it equals the
// catalog-hash.txt a build of the same store writes. There is no fallback: if the store can't be read, or a build would
// fall back to the mock catalogue or stop, it prints the reason on stderr, nothing on stdout, and exits 1.
//
// Run: npm run catalog:hash          the hash on stdout, a summary on stderr
//      npm run catalog:hash -- --print   the canonical catalogue that is hashed (JSON), instead of the hash
// The store domain and Storefront token come from the environment (repository secrets in CI), or from .env.local when
// they aren't set. Neither is ever printed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const envFile = path.join(ROOT, ".env.local");
if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN && fs.existsSync(envFile)) process.loadEnvFile(envFile);

const { readCatalogFromStore } = await import("../src/lib/catalog.ts");
const { canonicalCatalog, catalogHash } = await import("../src/lib/shopify/fingerprint.ts");

try {
  const snapshot = await readCatalogFromStore();
  if (process.argv.includes("--print")) {
    console.log(JSON.stringify(canonicalCatalog(snapshot), null, 1));
  } else {
    const hash = await catalogHash(snapshot);
    const collections = snapshot.collections.map(({ handle, collection }) => `${handle} ${collection ? collection.products.length : "(none)"}`).join(", ");
    console.error(`[catalog-hash] ${snapshot.products.length} products; collections: ${collections}.`);
    console.log(hash);
  }
} catch (error) {
  console.error(`[catalog-hash] ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
