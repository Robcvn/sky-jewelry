/**
 * catalog-hash.txt at the site's root (under the base path): the fingerprint of the Shopify catalogue this build used
 * (src/lib/shopify/fingerprint.ts), one line of 64 hex characters. The hourly catalogue check
 * (.github/workflows/catalog-check.yml) compares it with the store's and starts a deploy when they differ.
 * A build that didn't read the whole catalogue from Shopify writes "none: <reason>" instead, which the check treats as
 * an error; the deploy's catalogue check stops such a build before it goes live.
 */
import { getCatalogHash } from "@/lib/catalog";

export const dynamic = "force-static";

export async function GET() {
  const result = await getCatalogHash();
  const body = "hash" in result ? `${result.hash}\n` : `none: ${result.reason}\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
