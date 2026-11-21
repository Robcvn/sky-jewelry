"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, imagesFor, variantName, type Product, type ProductVariant } from "@/content/products";
import { Picture } from "./Picture";
import { MetalSwatches } from "./ProductCard";

/**
 * Figma "Product Card", Type=Search (Design System 2990:11354; Search Results mobile 4979:47760): a 120px square photo
 * on the product-image gradient beside the name (heading-sm), the price (ui-xs medium) with an optional note (ui-xs),
 * and the metal swatches, which switch the photo, name and price. The photo and name open the product's page.
 */
export function ProductCardSearch({ product, title, href, priceNote }: { product: Product; title?: string; href: string | ((variant: ProductVariant) => string); priceNote?: (variant: ProductVariant) => string | null }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const image = imagesFor(product, variant.metal)[0];
  const name = title ?? variantName(product, variant);
  const note = priceNote?.(variant) ?? null;
  return (
    <article className="relative flex items-center gap-space-4 text-primary-leather">
      <span className="relative block size-30 shrink-0 overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
        {image ? <Picture image={image} sizes={{ desktop: "120px", mobile: "120px" }} className="size-full object-cover mix-blend-multiply" /> : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-space-3">
        <div className="flex flex-col gap-space-1">
          <h3 className="type-heading-sm line-clamp-2">
            <Link href={typeof href === "string" ? href : href(variant)} className="after:absolute after:inset-0">
              {name}
            </Link>
          </h3>
          <p className="type-ui-xs-medium">
            {formatPrice(variant.price)}
            {note ? <span className="pl-space-1 font-normal">{note}</span> : null}
          </p>
        </div>
        <MetalSwatches product={product} variant={variant} onChange={setVariant} className="relative z-10 justify-start" />
      </div>
    </article>
  );
}
