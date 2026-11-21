import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EarringSettingDetail } from "@/components/earrings/EarringSettingDetail";
import { EarringsSteps } from "@/components/earrings/EarringsSteps";
import { earringSettingHref } from "@/components/earrings/routes";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards, WhatsInTheBox } from "@/components/pdp/DetailSections";
import { withBasePath } from "@/components/ui/shared";
import { homePage, type Reviews as ReviewsContent } from "@/content/home";
import { getEarringsCatalog } from "@/lib/earrings";

type Params = { handle: string };

/** One static page per earring setting. */
export async function generateStaticParams(): Promise<Params[]> {
  const { settings } = await getEarringsCatalog();
  return settings.map((setting) => ({ handle: setting.handle }));
}

export const dynamicParams = false;

async function findSetting({ handle }: Params) {
  const { settings } = await getEarringsCatalog();
  return settings.find((setting) => setting.handle === handle) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const setting = await findSetting(await params);
  return setting ? { title: setting.product.name, description: setting.product.description, alternates: { canonical: withBasePath(earringSettingHref(setting.handle)) } } : {};
}

/** The reviews section reuses the Home section and its sample reviews, as Product Detail does. */
const reviews = homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

/**
 * Earrings builder, Step 1: a setting's page (Figma desktop Custom Earrings - Setting Info 3565:98709, mobile
 * 3587:127517). Desktop closes with What's in the Box, the reviews and the button cards; the mobile frame has no
 * What's in the Box. Its "Your Diamond's Qualities" (visible on mobile, hidden on desktop) is left out: no diamond is
 * chosen on this page (a corrected design oversight).
 */
export default async function EarringSettingPage({ params }: { params: Promise<Params> }) {
  const setting = await findSetting(await params);
  if (!setting) notFound();
  const { product } = setting;

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
      <EarringsSteps current={1} />
      <EarringSettingDetail setting={setting} />
      <div className="hidden ui-desktop:block">
        <WhatsInTheBox />
      </div>
      <Reviews content={reviews} />
      <ButtonCards />
    </main>
  );
}
