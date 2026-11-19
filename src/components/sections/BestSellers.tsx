import { plainText } from "@/components/ui/RichText";
import type { BestSellers } from "@/content/landing/types";
import { getCatalog, pickProducts } from "@/lib/catalog";
import { ProductRows } from "./ProductRows";
import { LANDING_SECTION, SectionHeading } from "./SectionHeading";

/** Best sellers: real products read from Shopify at build time (mock fallback), in one or more rows. */
export async function BestSellersSection({ content }: { content: BestSellers }) {
  const headingId = `${content._key}-heading`;
  const { products } = await getCatalog();
  const rows = content.rows.map((row) => ({ _key: row._key, title: row.title, products: pickProducts(products, row.handles) }));
  return (
    <section aria-labelledby={headingId} className={LANDING_SECTION}>
      <SectionHeading id={headingId} overline={content.overline} heading={content.heading} />
      <ProductRows rows={rows} label={plainText(content.heading)} />
    </section>
  );
}
