import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuilderSteps } from "@/components/builder/BuilderSteps";
import { settingHref } from "@/components/builder/ring";
import { SettingDetail } from "@/components/builder/SettingDetail";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards } from "@/components/pdp/DetailSections";
import { withBasePath } from "@/components/ui/shared";
import { PAIRED_BAND_HANDLES } from "@/content/builder";
import type { Reviews as ReviewsContent } from "@/content/home";
import { getEditorialContent } from "@/lib/content";
import { getBuilderCatalog, stoneSummary } from "@/lib/builder";
import { getCatalog, pickProducts } from "@/lib/catalog";

type Params = { handle: string };

/** One static page per ring setting: the engagement rings in the catalogue plus the builder's seed settings. */
export async function generateStaticParams(): Promise<Params[]> {
  const { settings } = await getBuilderCatalog();
  return settings.map((setting) => ({ handle: setting.handle }));
}

export const dynamicParams = false;

async function findSetting({ handle }: Params) {
  const { settings } = await getBuilderCatalog();
  return settings.find((setting) => setting.handle === handle) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const setting = await findSetting(await params);
  return setting ? { title: setting.product.name, description: setting.product.description, alternates: { canonical: withBasePath(settingHref(setting.handle)) } } : {};
}


/** The reviews section reuses the Home section and its sample reviews, as Product Detail does. */
const homeReviews = async () => (await getEditorialContent()).homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

export default async function SettingPage({ params }: { params: Promise<Params> }) {
  const setting = await findSetting(await params);
  if (!setting) notFound();
  const { product } = setting;
  const { products } = await getCatalog();
  const bands = pickProducts(products, PAIRED_BAND_HANDLES);
  // Stone first, this page is Step 2: the stones go along, slim, for the step bar and the chosen stone's shape and origin.
  const stones = (await getBuilderCatalog()).stones.map(stoneSummary);

  // Structured data for search engines: the setting and its metals' price range.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.variants[0].sku ?? undefined,
    brand: { "@type": "Brand", name: "Sky Jewelry" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: product.priceFrom,
      highPrice: Math.max(...product.variants.map((variant) => variant.price)),
      offerCount: product.variants.length,
    },
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <BuilderSteps current={1} stones={stones} />
      <SettingDetail setting={setting} bands={bands} stones={stones} />
      <Reviews content={await homeReviews()} />
      <ButtonCards />
    </main>
  );
}
