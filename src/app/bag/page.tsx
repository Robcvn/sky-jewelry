import type { Metadata } from "next";
import { BagPage } from "@/components/bag/BagPage";
import { bagContent } from "@/content/bag";
import { getCatalog, pickProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: bagContent.heading,
  description: "The pieces in your Sky Jewelry bag.",
  // A personal, client-rendered page: nothing for search engines.
  robots: { index: false, follow: false },
};

/** The bag page. The lines come from the shopper's Shopify cart in the browser; the paired bands from the build. */
export default async function Bag() {
  const { products } = await getCatalog();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <BagPage pairedBands={pickProducts(products, bagContent.pairedBands.handles)} />
    </main>
  );
}
