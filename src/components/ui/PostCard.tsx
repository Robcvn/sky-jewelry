import Link from "next/link";
import { Icon } from "./Icon";
import { Picture, type ImageRef } from "./Picture";

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

type PostCardProps = {
  title: string;
  excerpt: string;
  topic: string;
  /** ISO date */
  date: string;
  readTime: string;
  href: string;
  image: ImageRef;
  sizes: { desktop: string; mobile: string };
};

/** Figma "Post Card", Size=LG: a 4:3 photo, topic, date and read time, title, excerpt and "read more". */
export function PostCard({ title, excerpt, topic, date, readTime, href, image, sizes }: PostCardProps) {
  return (
    <Link href={href} className="group flex flex-col gap-space-4 rounded-8 text-primary-leather">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-4 bg-secondary-ivory">
        <Picture
          image={image}
          sizes={sizes}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </span>
      <span className="flex flex-col gap-space-3 ui-desktop:gap-space-4 ui-desktop:pr-space-8">
        <span className="flex flex-col gap-space-2">
          <span className="type-overline-xs-medium flex flex-wrap items-center gap-space-2 text-black-alpha-60">
            <span>{topic}</span>
            <span aria-hidden="true" className="h-2.5 w-px bg-black-alpha-20" />
            <time dateTime={date}>{DATE.format(new Date(date))}</time>
            <span aria-hidden="true" className="h-2.5 w-px bg-black-alpha-20" />
            <span>{readTime}</span>
          </span>
          <h3 className="type-heading-sm ui-desktop:type-heading-md">{title}</h3>
        </span>
        {/* Figma (Home 3587:124551 / 3565:101343): meta to title 8, then title to excerpt to Read more 12 / 16. */}
        <span className="type-body-xs-regular ui-desktop:type-body-sm-regular">{excerpt}</span>
        <span className="type-overline-xs-medium ui-transition-fast inline-flex items-center gap-space-1 group-hover:text-black-alpha-50">
          Read more
          <Icon name="chevron-right" size={16} />
        </span>
      </span>
    </Link>
  );
}
