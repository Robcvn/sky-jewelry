import Link from "next/link";
import { Picture, type ImageRef } from "./Picture";
import { cx } from "./shared";

type CategoryCardProps = {
  label: string;
  href: string;
  image: ImageRef;
  sizes: { desktop: string; mobile: string };
  className?: string;
};

/** Figma "Category Card - Quick": a square photo with a frosted label pill at the bottom. */
export function CategoryCard({ label, href, image, sizes, className }: CategoryCardProps) {
  return (
    <Link href={href} className={cx("group relative block aspect-square overflow-hidden bg-secondary-ivory focus-visible:-outline-offset-2", className)}>
      <Picture image={image} sizes={sizes} className="absolute inset-0 size-full object-cover" />
      <span className="absolute inset-x-0 bottom-0 flex justify-center p-space-5">
        <span className="type-overline-xs-medium ui-transition rounded-full bg-white-alpha-5 p-space-1 whitespace-nowrap text-primary-leather backdrop-blur-[15px] group-hover:bg-white-alpha-50">
          {label}
        </span>
      </span>
    </Link>
  );
}
