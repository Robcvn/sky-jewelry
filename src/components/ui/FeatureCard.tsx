import Link from "next/link";
import { Icon } from "./Icon";
import { Picture, type ImageRef } from "./Picture";
import { cx } from "./shared";

type FeatureCardProps = {
  title: string;
  body?: string;
  ctaLabel: string;
  href: string;
  image: ImageRef;
  sizes: { desktop: string; mobile: string };
  /** False for the mobile title-only cards (Figma's 2 x 2 grids): the CTA and its hairline show from 1024px. */
  ctaOnMobile?: boolean;
  /** Figma's cards with a body line use a 16px desktop caption padding instead of 24. */
  compact?: boolean;
  /** Size and aspect ratio of the card, which differ per use. */
  className?: string;
};

/**
 * Figma "Feature Card": a photo with a dark gradient, a centred title, optional body and a text CTA
 * over a hairline. The whole card is one link. Figma hides a chevron beside the CTA; it shows on hover.
 */
export function FeatureCard({ title, body, ctaLabel, href, image, sizes, ctaOnMobile = true, compact = false, className }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={cx(
        "group relative isolate flex flex-col justify-end overflow-hidden rounded-4 bg-secondary-ivory px-space-3 text-center text-secondary-skin ui-desktop:px-space-6",
        className,
      )}
    >
      <Picture image={image} sizes={sizes} className="ui-transition absolute inset-0 -z-10 size-full rounded-4 object-cover" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-black-alpha-0 from-25% to-black-alpha-40 to-75%" />
      <span className={cx("flex flex-col gap-space-1 py-space-3 ui-desktop:gap-space-2", compact ? "ui-desktop:py-space-4" : "ui-desktop:py-space-6")}>
        <h3 className="type-heading-sm ui-desktop:type-heading-md">{title}</h3>
        {body ? <span className="type-body-xs-regular mx-auto max-w-[30rem]">{body}</span> : null}
      </span>
      <span className={cx("justify-center border-t border-white-alpha-20 pt-space-3 pb-space-4 ui-desktop:pt-space-4", ctaOnMobile ? "flex" : "hidden ui-desktop:flex")}>
        <span className="type-overline-xs-medium relative py-space-1">
          {ctaLabel}
          <Icon
            name="chevron-right"
            size={12}
            className="ui-transition absolute top-1/2 -right-space-5 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </span>
      </span>
    </Link>
  );
}
