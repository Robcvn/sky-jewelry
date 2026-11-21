import type { Metadata } from "next";
import { CompleteEarrings } from "@/components/earrings/CompleteEarrings";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards } from "@/components/pdp/DetailSections";
import { withBasePath } from "@/components/ui/shared";
import { EARRINGS_COMPLETE_ROUTE, earringsContent } from "@/content/earrings";
import type { Reviews as ReviewsContent } from "@/content/home";
import { getEditorialContent } from "@/lib/content";
import { getEarringsCatalog } from "@/lib/earrings";

export const metadata: Metadata = {
  title: earringsContent.complete.seo.title,
  description: earringsContent.complete.seo.description,
  alternates: { canonical: withBasePath(EARRINGS_COMPLETE_ROUTE) },
  // The earrings live in the URL and the page has no content without them: kept out of search results, links followed.
  robots: { index: false, follow: true },
};

const homeReviews = async () => (await getEditorialContent()).homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

/**
 * Earrings builder Step 3: the complete earrings. One static page with every setting and pair; the earrings
 * (?setting=&metal=&shape=&stone=) are read from the URL in the browser (see CompleteEarrings). Figma's Complete
 * frames close with the reviews and the button cards (no What's in the Box).
 */
export default async function CompleteEarringsPage() {
  const { settings, pairs } = await getEarringsCatalog();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <CompleteEarrings settings={settings} pairs={pairs}>
        <Reviews content={await homeReviews()} />
        <ButtonCards />
      </CompleteEarrings>
    </main>
  );
}
