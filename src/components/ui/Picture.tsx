import { imageManifest as homeManifest } from "@/content/image-manifest";
import { landingImageManifest } from "@/content/landing-image-manifest";
import { pdpImageManifest } from "@/content/pdp-image-manifest";
import { productGalleryManifest } from "@/content/product-gallery-manifest";
import { productImageManifest } from "@/content/product-image-manifest";
import { withBasePath } from "./shared";

// The PDP manifest comes after the product gallery one, so a crop made from Figma's original (the pendant's mobile
// gallery photo) wins over the one generated from the Shopify source.
const imageManifest = { ...homeManifest, ...productImageManifest, ...productGalleryManifest, ...pdpImageManifest, ...landingImageManifest };
export type ImageKey = keyof typeof imageManifest;

/**
 * The same photo in a full-size slot ("gallery-m", "quickview", "gallery-d-wide"; see scripts/build-product-images.mjs
 * --gallery): every breakpoint uses the slot's files. Falls back to the photo as it is when there is no such crop.
 */
export function slotImage(image: ImageRef, slot: "gallery-m" | "quickview" | "gallery-d-wide"): ImageRef {
  const key = `${image.desktop}-${slot}`;
  return key in imageManifest ? { desktop: key as ImageKey, alt: image.alt } : image;
}

/** A Sanity-style image reference: the crop for each breakpoint, and alt text. */
export type ImageRef = { desktop: ImageKey; mobile?: ImageKey; alt: string };

const srcSet = (key: ImageKey) => imageManifest[key].map((file) => `${withBasePath(file.src)} ${file.w}w`).join(", ");

type PictureProps = {
  image: ImageRef;
  /** The rendered width at each breakpoint, as a sizes value, e.g. "100vw". */
  sizes: { desktop: string; mobile: string };
  /** Above the fold: load eagerly with high priority. Everything else lazy-loads. */
  priority?: boolean;
  className?: string;
};

/**
 * Pre-generated WebP crops at 1x and 2x of the size Figma renders (see src/content/image-manifest.ts).
 * The site is a static export with unoptimised images, so next/image cannot make these variants itself,
 * and a <picture> is needed for the separate desktop and mobile crops.
 */
export function Picture({ image, sizes, priority = false, className }: PictureProps) {
  const mobile = image.mobile ?? image.desktop;
  const base = imageManifest[mobile][0];

  return (
    <picture>
      {image.mobile ? (
        <source
          media="(width >= 64rem)"
          srcSet={srcSet(image.desktop)}
          sizes={sizes.desktop}
          width={imageManifest[image.desktop][0].w}
          height={imageManifest[image.desktop][0].h}
        />
      ) : null}
      <img
        src={withBasePath(base.src)}
        srcSet={srcSet(mobile)}
        sizes={image.mobile ? sizes.mobile : `(width >= 64rem) ${sizes.desktop}, ${sizes.mobile}`}
        width={base.w}
        height={base.h}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding={priority ? "sync" : "async"}
        className={className}
      />
    </picture>
  );
}
