import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuilderSteps } from "@/components/builder/BuilderSteps";
import { stoneHref } from "@/components/builder/ring";
import { StoneDetail } from "@/components/builder/StoneDetail";
import { StoneDetailQualities } from "@/components/builder/StoneDetailQualities";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards } from "@/components/pdp/DetailSections";
import { withBasePath } from "@/components/ui/shared";
import type { Reviews as ReviewsContent } from "@/content/home";
import { getEditorialContent } from "@/lib/content";
import { getBuilderCatalog } from "@/lib/builder";

type Params = { handle: string };

/** One static page per loose stone in the builder's catalogue (Shopify, or the local seed until the import). */
export async function generateStaticParams(): Promise<Params[]> {
  const { stones } = await getBuilderCatalog();
  return stones.map((stone) => ({ handle: stone.handle }));
}

export const dynamicParams = false;

async function findStone({ handle }: Params) {
  const { stones } = await getBuilderCatalog();
  return stones.find((stone) => stone.handle === handle) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const stone = await findStone(await params);
  return stone ? { title: stone.title, description: stone.description, alternates: { canonical: withBasePath(stoneHref(stone.handle)) } } : {};
}

/** The reviews section reuses the Home section and its sample reviews, as Product Detail does. */
const homeReviews = async () => (await getEditorialContent()).homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

/**
 * Ring builder, Step 2: a stone's page (Figma desktop Builder 2 - Stone Info 3565:100732, mobile 3587:125910).
 * The ring being built (?setting=&metal=&shape=) is read from the URL in the browser.
 */
export default async function StonePage({ params }: { params: Promise<Params> }) {
  const stone = await findStone(await params);
  if (!stone) notFound();
  const { settings } = await getBuilderCatalog();

  // Structured data for search engines: the stone and its offer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: stone.title,
    description: stone.description,
    sku: stone.sku || undefined,
    brand: { "@type": "Brand", name: "Sky Jewelry" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: stone.price,
      availability: stone.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <BuilderSteps current={2} settings={settings.map((setting) => setting.product)} />
      <StoneDetail stone={stone} />
      {/* Figma draws "Your Diamond's Qualities" for a diamond; gemstones are graded on other scales, so they have no such section. */}
      {stone.kind === "diamond" ? <StoneDetailQualities stone={stone} /> : null}
      <Reviews content={await homeReviews()} />
      <ButtonCards />
    </main>
  );
}
