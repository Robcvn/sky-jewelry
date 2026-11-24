import { plainText } from "@/components/ui/RichText";
import type { BestSellers } from "@/content/landing/types";
import { getCatalog, pickProducts } from "@/lib/catalog";
import { ProductRows } from "./ProductRows";
import { LANDING_SECTION, SectionHeading, TOP_HAIRLINE } from "./SectionHeading";

/**
 * Best sellers: real products read from Shopify at build time (mock fallback), in one or more rows. On the content
 * pages (Resource Detail, Post Detail, the stories, Our Story: e.g. 3565:102063, 3587:130091, 5110:36340) the section
 * has a full-width hairline along its top; the landing pages draw none, so it's opt-in (`hairline`).
 */
export async function BestSellersSection({ content, hairline = false, arrowDrop }: { content: BestSellers; hairline?: boolean; arrowDrop?: string }) {
  const headingId = `${content._key}-heading`;
  const { products } = await getCatalog();
  const rows = content.rows.map((row) => ({ _key: row._key, title: row.title, products: pickProducts(products, row.handles) }));
  return (
    <section aria-labelledby={headingId} className={hairline ? `${LANDING_SECTION} ${TOP_HAIRLINE}` : LANDING_SECTION}>
      <SectionHeading id={headingId} overline={content.overline} heading={content.heading} />
      <ProductRows rows={rows} label={plainText(content.heading)} arrowDrop={arrowDrop} />
    </section>
  );
}
