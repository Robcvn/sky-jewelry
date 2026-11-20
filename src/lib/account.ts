/*
 * Account data for the pages, resolved at build time. Orders are mock content (src/content/account.ts); each line's
 * name, photo, link and size come from the build's catalogue by handle, its price from the order (what was paid).
 * Nothing is read from or written to Shopify beyond the catalogue the rest of the site already reads.
 */
import type { ImageRef } from "@/components/ui/Picture";
import { stoneFacts } from "@/components/pdp/productFacts";
import { orderSubtotal, orderTotal, type Order } from "@/content/account";
import { fillTitle } from "@/content/catalog-seed";
import type { MetalId } from "@/content/metals";
import type { Product } from "@/content/products";

export type ResolvedOrderLine = {
  key: string;
  /** Short name, as in the bag: the title without metal and carat. */
  name: string;
  href: string;
  image: ImageRef | null;
  metal: MetalId;
  carat: number | null;
  /** Chain or bracelet length, e.g. "16-18"; rings have none in the catalogue. */
  length: string | null;
  quantity: number;
  price: number;
  /** Shown where the product page shows View Certificate (a graded stone). */
  certificate: boolean;
};

export type ResolvedOrder = Omit<Order, "lines"> & { lines: ResolvedOrderLine[]; subtotal: number; total: number };

export function resolveOrder(order: Order, products: Product[]): ResolvedOrder {
  const lines = order.lines.flatMap((line): ResolvedOrderLine[] => {
    const product = products.find((item) => item.slug === line.handle);
    if (!product) {
      console.warn(`[account] order ${order.number}: no catalogue product "${line.handle}", line left out.`);
      return [];
    }
    const exact = product.variants.find((item) => item.metal === line.metal && item.carat === line.carat);
    if (!exact) console.warn(`[account] order ${order.number}: "${line.handle}" has no ${line.metal} ${line.carat ?? ""} variant; using the closest.`);
    const variant = exact ?? product.variants.find((item) => item.metal === line.metal) ?? product.variants[0];
    const image = product.images[variant.metal]?.[0] ?? product.image;
    return [
      {
        key: line._key,
        name: fillTitle(product.titleTemplate, "", null),
        href: `/fine-jewelry/${product.category}/${product.slug}/`,
        image: image ? { ...image, alt: "" } : null,
        metal: variant.metal,
        carat: line.carat,
        length: product.length,
        quantity: line.quantity,
        price: line.price,
        certificate: Boolean(stoneFacts(product, variant)?.lab),
      },
    ];
  });
  return { ...order, lines, subtotal: orderSubtotal(order), total: orderTotal(order) };
}
