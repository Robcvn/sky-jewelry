import { Picture, type ImageRef } from "./Picture";
import { cx } from "./shared";

type ImageBlockProps = {
  image: ImageRef;
  caption: string;
  sizes: { desktop: string; mobile: string };
  /** Classes for the image box, e.g. its height or aspect ratio. */
  imageClassName?: string;
  className?: string;
};

/**
 * Figma "Image Block": a rounded photo with a caption below.
 * Desktop: caption body-sm, gap 16. Mobile: square photo, caption body-xs, gap 12.
 */
export function ImageBlock({ image, caption, sizes, imageClassName, className }: ImageBlockProps) {
  return (
    <figure className={cx("flex flex-col gap-space-3 text-primary-leather ui-desktop:gap-space-4", className)}>
      <span className={cx("relative block overflow-hidden rounded-4 bg-secondary-ivory", imageClassName)}>
        <Picture image={image} sizes={sizes} className="absolute inset-0 size-full object-cover" />
      </span>
      <figcaption className="type-body-xs-regular ui-desktop:type-body-sm-regular">{caption}</figcaption>
    </figure>
  );
}
