"use client";

import { useCallback, useState } from "react";
import { BagToast, type BagNotice } from "@/components/plp/BagToast";
import { QuickView } from "@/components/plp/QuickView";
import { Carousel } from "@/components/ui/Carousel";
import { ProductCard } from "@/components/ui/ProductCard";
import { productListContent } from "@/content/product-list";
import { variantName, type Product, type ProductVariant } from "@/content/products";
import { addToBag } from "@/lib/bag";
import { CARD_ITEM, CARD_W } from "./SectionHeading";

type Row = { _key: string; title?: string; products: Product[] };

/**
 * Best-seller rows of the product list's Product Card (with its desktop hover state), one carousel per row.
 * Mobile taps open the same quick-view sheet as the product list; Add to Bag uses the Shopify cart.
 */
export function ProductRows({ rows, label }: { rows: Row[]; label: string }) {
  const [quickView, setQuickView] = useState<{ product: Product; variant: ProductVariant; open: boolean } | null>(null);
  const [notice, setNotice] = useState<BagNotice | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const onAddToBag = useCallback(async (product: Product, variant: ProductVariant) => {
    const name = variantName(product, variant);
    setBusy(product.slug);
    const result = await addToBag(variant.id);
    setBusy(null);
    setNotice({ id: Date.now(), tone: result.ok ? "success" : "error", text: result.ok ? `Added to bag: ${name}` : `Couldn't add ${name} to the bag. Please try again.` });
  }, []);
  const dismiss = useCallback(() => setNotice(null), []);

  return (
    <div className="flex flex-col gap-space-10 ui-desktop:gap-space-11">
      {rows.map((row) => (
        <div key={row._key} className="flex flex-col gap-space-6">
          {row.title ? <h3 className="site-container type-overline-xs-medium text-center text-primary-leather ui-desktop:type-overline-sm-medium">{row.title}</h3> : null}
          <Carousel
            label={row.title ?? label}
            itemClassName={CARD_ITEM}
            arrowTop={`calc(${CARD_W} / 2)`}
            hoverRoom
            items={row.products.map((product) => ({
              key: product.slug,
              node: (
                <ProductCard
                  product={product}
                  initialVariant={product.variants[0]}
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
      <BagToast notice={notice} onDismiss={dismiss} />
    </div>
  );
}
