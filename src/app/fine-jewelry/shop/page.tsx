import type { Metadata } from "next";
import { ProductListing } from "@/components/plp/ProductListing";
import { productListContent } from "@/content/product-list";
import { FINE_JEWELRY_CATEGORIES } from "@/content/products";
import { getCategoryProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: productListContent.allTitle, description: productListContent.allDescription };

/**
 * All Fine Jewelry: the product list page with every Fine Jewelry product, no category tab selected and all
 * filters available (not drawn in Figma; see the report). Each category comes from the same source as its own
 * page (its Shopify collection, product type, or the mock fallback). Best Match lists rings, necklaces,
 * earrings, then bracelets, each in its own order.
 */
export default async function AllFineJewelryPage() {
  const lists = await Promise.all(FINE_JEWELRY_CATEGORIES.map((category) => getCategoryProducts(category)));
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <ProductListing category={null} products={lists.flatMap((list) => list.products)} />
    </main>
  );
}
