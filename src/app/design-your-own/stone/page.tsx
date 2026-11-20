import type { Metadata } from "next";
import { BuilderSteps } from "@/components/builder/BuilderSteps";
import { STONES_PATH } from "@/components/builder/ring";
import { StoneListing } from "@/components/builder/StoneListing";
import { withBasePath } from "@/components/ui/shared";
import { builderContent } from "@/content/builder";
import { getBuilderCatalog } from "@/lib/builder";

export const metadata: Metadata = {
  title: builderContent.stones.seo.title,
  description: builderContent.stones.seo.description,
  alternates: { canonical: withBasePath(STONES_PATH) },
};

/**
 * Ring builder Step 2: choose a stone. One static page; the ring (its setting, metal and shape) and the filters
 * live in the query string and apply as the page hydrates.
 */
export default async function ChooseStonePage() {
  const { settings, stones } = await getBuilderCatalog();
  const products = settings.map((setting) => setting.product);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <BuilderSteps current={2} settings={products} />
      {/* Stones Shopify reports as unavailable at build time are left out of the list (their pages and Step 3 still read them). */}
      <StoneListing stones={stones.filter((stone) => stone.available)} settings={products} />
    </main>
  );
}
