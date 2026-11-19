import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reviews } from "@/components/home/Reviews";
import { ButtonCards, DiamondQualities, WhatsInTheBox } from "@/components/pdp/DetailSections";
import { ProductDetail } from "@/components/pdp/ProductDetail";
import { homePage, type Reviews as ReviewsContent } from "@/content/home";
import { sampleDiamondGrades } from "@/content/product-detail";
import { isFineJewelry, productHref } from "@/content/products";
import { getCatalog } from "@/lib/catalog";

type Params = { category: string; handle: string };

/** One static page per Fine Jewelry product in the catalogue (Shopify, or the mock fallback). */
export async function generateStaticParams(): Promise<Params[]> {
  const { products } = await getCatalog();
  return products.filter((product) => isFineJewelry(product.category)).map((product) => ({ category: product.category, handle: product.slug }));
}

export const dynamicParams = false;

async function findProduct({ category, handle }: Params) {
  const { products } = await getCatalog();
  return products.find((product) => product.category === category && product.slug === handle) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const product = await findProduct(await params);
  return product ? { title: product.name, description: product.description, alternates: { canonical: productHref(product) } } : {};
}

/** The reviews section reuses the Home section and its sample reviews (Figma's PDP reviews are placeholder text). */
const reviews = homePage.sections.find((section): section is ReviewsContent => section._type === "reviews")!;

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const product = await findProduct(await params);
  if (!product) notFound();
  const first = product.variants[0];

  // Structured data for search engines: the product and its default offer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: first.sku ?? undefined,
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
      <ProductDetail product={product} />
      {product.diamondType ? <DiamondQualities grades={sampleDiamondGrades[product.diamondType]} /> : null}
      <WhatsInTheBox />
      <Reviews content={reviews} />
      <ButtonCards />
    </main>
  );
}
