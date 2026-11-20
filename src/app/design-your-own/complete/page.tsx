import type { Metadata } from "next";
import { CompleteRing } from "@/components/builder/CompleteRing";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards, WhatsInTheBox } from "@/components/pdp/DetailSections";
import { withBasePath } from "@/components/ui/shared";
import { builderContent, COMPLETE_ROUTE, PAIRED_BAND_HANDLES } from "@/content/builder";
import { homePage, type Reviews as ReviewsContent } from "@/content/home";
import { getBuilderCatalog } from "@/lib/builder";
import { getCatalog, pickProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: builderContent.complete.seo.title,
  description: builderContent.complete.seo.description,
  alternates: { canonical: withBasePath(COMPLETE_ROUTE) },
  // The ring lives in the URL and the page has no content without one: kept out of search results, links followed.
  robots: { index: false, follow: true },
};

/** The reviews section reuses the Home section and its sample reviews, as Product Detail does. */
const reviews = homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

/**
 * Ring builder Step 3: the complete ring. One static page with every setting and stone; the ring
 * (?setting=&metal=&shape=&stone=&size=) is read from the URL in the browser (see CompleteRing).
 */
export default async function CompletePage() {
  const { settings, stones } = await getBuilderCatalog();
  const { products } = await getCatalog();
  const bands = pickProducts(products, PAIRED_BAND_HANDLES);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <CompleteRing settings={settings} stones={stones} bands={bands}>
        <WhatsInTheBox />
        <Reviews content={reviews} />
        <ButtonCards />
      </CompleteRing>
    </main>
  );
}
