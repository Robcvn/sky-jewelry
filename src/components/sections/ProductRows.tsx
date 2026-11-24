"use client";

import { useCallback, useState } from "react";
import { QuickView } from "@/components/plp/QuickView";
import { Carousel } from "@/components/ui/Carousel";
import { ProductCard } from "@/components/ui/ProductCard";
import { productListContent } from "@/content/product-list";
import type { Product, ProductVariant } from "@/content/products";
import { addToBag } from "@/lib/bag";
import { openingVariant } from "@/lib/swatches";
import { CARD_ITEM, CARD_W } from "./SectionHeading";

type Row = { _key: string; title?: string; products: Product[] };

/**
 * Best-seller rows of the product list's Product Card (with its desktop hover state), one carousel per row.
 * Mobile taps open the same quick-view sheet as the product list; Add to Bag uses the Shopify cart.
 */
export function ProductRows({
  rows,
  label,
  itemClassName = CARD_ITEM,
  cardWidth = CARD_W,
  arrowDrop,
}: {
  rows: Row[];
  label: string;
  itemClassName?: string;
  cardWidth?: string;
  /** How far below the photos' centre the arrows sit, where a frame draws them lower (e.g. "1.3125rem"). */
  arrowDrop?: string;
}) {
  const [quickView, setQuickView] = useState<{ product: Product; variant: ProductVariant; open: boolean } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Adding opens the bag panel (the header draws it); a failure is shown there too.
  const onAddToBag = useCallback(async (product: Product, variant: ProductVariant) => {
    setBusy(product.slug);
    await addToBag(product, variant);
    setBusy(null);
  }, []);

  return (
    <div className="flex flex-col gap-space-10 ui-desktop:gap-space-11">
      {rows.map((row) => (
        <div key={row._key} className="flex flex-col gap-space-6">
          {row.title ? <h3 className="site-container type-overline-xs-medium text-center text-primary-leather ui-desktop:type-overline-sm-medium">{row.title}</h3> : null}
          <Carousel
            label={row.title ?? label}
            itemClassName={itemClassName}
            arrowTop={arrowDrop ? `calc(${cardWidth} / 2 + ${arrowDrop})` : `calc(${cardWidth} / 2)`}
            hoverRoom
            items={row.products.map((product) => ({
              key: product.slug,
              node: (
                <ProductCard
                  product={product}
                  initialVariant={openingVariant(product)}
                  labels={productListContent.card}
                  size="carousel"
                  busy={busy === product.slug}
                  onAddToBag={onAddToBag}
                  onQuickView={(item, chosen) => setQuickView({ product: item, variant: chosen, open: true })}
                />
              ),
            }))}
          />
        </div>
      ))}
      {quickView ? (
        <QuickView
          key={`${quickView.product.slug}-${quickView.variant.metal}-${quickView.variant.carat}`}
          product={quickView.product}
          initialVariant={quickView.variant}
          open={quickView.open}
          onClose={() => setQuickView({ ...quickView, open: false })}
          onAddToBag={onAddToBag}
          busy={busy === quickView.product.slug}
          labels={{ ...productListContent.card, close: "Close" }}
        />
      ) : null}
    </div>
  );
}
