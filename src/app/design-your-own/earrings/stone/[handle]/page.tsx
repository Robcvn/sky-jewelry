import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EarringsSteps } from "@/components/earrings/EarringsSteps";
import { PairDetail, PairQualities } from "@/components/earrings/PairDetail";
import { pairHref } from "@/components/earrings/routes";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards, WhatsInTheBox } from "@/components/pdp/DetailSections";
import { withBasePath } from "@/components/ui/shared";
import { homePage, type Reviews as ReviewsContent } from "@/content/home";
import { getEarringsCatalog } from "@/lib/earrings";

type Params = { handle: string };

/** One static page per matched pair (Shopify, or the local seed until the import). */
export async function generateStaticParams(): Promise<Params[]> {
  const { pairs } = await getEarringsCatalog();
  return pairs.map((pair) => ({ handle: pair.handle }));
}

export const dynamicParams = false;

async function findPair({ handle }: Params) {
  const { pairs } = await getEarringsCatalog();
  return pairs.find((pair) => pair.handle === handle) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const pair = await findPair(await params);
  return pair ? { title: pair.title, description: pair.description, alternates: { canonical: withBasePath(pairHref(pair.handle)) } } : {};
}

const reviews = homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

/**
 * Earrings builder, Step 2: a pair's page (Figma desktop Custom Earrings - Stones Info 3565:99083, mobile
 * 3587:127889). After the page: the qualities, What's in the Box (desktop frame only), the reviews and the button cards.
 */
export default async function PairPage({ params }: { params: Promise<Params> }) {
  const pair = await findPair(await params);
  if (!pair) notFound();
  const { settings } = await getEarringsCatalog();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pair.title,
    description: pair.description,
    sku: pair.sku || undefined,
    brand: { "@type": "Brand", name: "Sky Jewelry" },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: pair.price,
      availability: pair.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <EarringsSteps current={2} settings={settings.map((setting) => setting.product)} />
      <PairDetail pair={pair} />
      <PairQualities pair={pair} />
      <div className="hidden ui-desktop:block">
        <WhatsInTheBox />
      </div>
      <Reviews content={reviews} />
      <ButtonCards />
    </main>
  );
}
