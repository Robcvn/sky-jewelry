import type { Metadata } from "next";
import { EarringsSteps } from "@/components/earrings/EarringsSteps";
import { PairListing } from "@/components/earrings/PairListing";
import { withBasePath } from "@/components/ui/shared";
import { EARRINGS_STONES_ROUTE, earringsContent } from "@/content/earrings";
import { getEarringsCatalog } from "@/lib/earrings";

export const metadata: Metadata = {
  title: earringsContent.stones.seo.title,
  description: earringsContent.stones.seo.description,
  alternates: { canonical: withBasePath(EARRINGS_STONES_ROUTE) },
};

/**
 * Earrings builder Step 2: choose a matched pair of diamonds. One static page; the earrings (setting, metal,
 * shape) and the filters live in the query string and apply as the page hydrates.
 */
export default async function ChoosePairPage() {
  const { settings, pairs } = await getEarringsCatalog();
  const products = settings.map((setting) => setting.product);
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <EarringsSteps current={2} settings={products} />
      {/* Pairs Shopify reports as unavailable at build time are left out of the list (their pages and Step 3 still read them). */}
      <PairListing pairs={pairs.filter((pair) => pair.available)} settings={products} />
    </main>
  );
}
