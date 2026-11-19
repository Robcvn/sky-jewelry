import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/plp/ProductListing";
import { productListContent } from "@/content/product-list";
import { FINE_JEWELRY_CATEGORIES, isFineJewelry } from "@/content/products";
import { getCategoryProducts } from "@/lib/catalog";

type Params = { category: string };

/** One static page per Fine Jewelry category, matching the menu's /fine-jewelry/<category>/ links. */
export function generateStaticParams(): Params[] {
  return FINE_JEWELRY_CATEGORIES.map((category) => ({ category }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const tab = productListContent.categories.find((item) => item._key === category);
  return tab ? { title: `${tab.title} | Fine Jewelry`, description: tab.description } : {};
}

export default async function FineJewelryCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  if (!isFineJewelry(category)) notFound();
  const { products } = await getCategoryProducts(category);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <ProductListing category={category} products={products} />
    </main>
  );
}
