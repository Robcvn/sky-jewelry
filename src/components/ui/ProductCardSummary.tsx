import Link from "next/link";
import { Picture, type ImageRef } from "./Picture";

type ProductCardSummaryProps = {
  name: string;
  /** Optional: the metal tiles show the name only. */
  body?: string;
  /** e.g. "starting at $999". Optional: shape, colour and metal tiles have no price line. */
  priceLabel?: string;
  href: string;
  image: ImageRef;
  sizes: { desktop: string; mobile: string };
};

/**
 * Figma "Product Card - Summary": a square product shot on the product-image radial background
 * (multiplied, so the photo's grey backdrop disappears), name, short body and a "starting at" line.
 */
export function ProductCardSummary({ name, body, priceLabel, href, image, sizes }: ProductCardSummaryProps) {
  return (
    <Link href={href} className="group flex flex-col overflow-hidden text-center text-primary-leather">
      <span className="relative block aspect-square overflow-hidden rounded-4 bg-[radial-gradient(var(--color-secondary-pure-white),var(--color-secondary-skin))]">
        <Picture
          image={image}
          sizes={sizes}
          className="ui-transition absolute inset-0 size-full object-cover mix-blend-multiply group-hover:scale-105 motion-reduce:group-hover:scale-100 [transition-property:transform]"
        />
      </span>
      <span className="flex flex-col gap-space-4 px-space-6 pt-space-4">
        <span className="flex flex-col gap-space-2">
          <h3 className="type-heading-sm">{name}</h3>
          {body ? <span className="type-body-xs-regular">{body}</span> : null}
        </span>
        {priceLabel ? (
          <span className="border-t border-secondary-gold py-space-4">
            <span className="type-overline-xs-medium inline-block py-space-1">{priceLabel}</span>
          </span>
        ) : null}
      </span>
    </Link>
  );
}
