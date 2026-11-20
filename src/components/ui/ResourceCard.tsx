import Link from "next/link";
import { ButtonLink } from "./Button";
import { Icon } from "./Icon";
import { Picture, type ImageRef } from "./Picture";

type ResourceCardProps = {
  topic: string;
  title: string;
  href: string;
  image: ImageRef;
  sizes: { desktop: string; mobile: string };
};

/** Figma "Resource Card", Size=LG: a wide photo, topic, title, body and a Read More button. */
export function ResourceCardLarge({ topic, title, body, href, ctaLabel, image, sizes }: ResourceCardProps & { body: string; ctaLabel: string }) {
  return (
    <article className="flex flex-col gap-space-4 text-primary-leather ui-desktop:gap-space-6 ui-desktop:pr-space-4">
      <div className="relative aspect-[702/400] overflow-hidden rounded-4 bg-secondary-ivory">
        <Picture image={image} sizes={sizes} className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="flex flex-col gap-space-4 ui-desktop:gap-space-6">
        <div className="flex flex-col gap-space-2 ui-desktop:gap-space-4">
          <p className="type-overline-xs-medium">{topic}</p>
          <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
            <h3 className="type-heading-sm ui-desktop:type-heading-md">{title}</h3>
            <p className="type-body-xs-regular line-clamp-3 max-w-[35rem] ui-desktop:line-clamp-none">{body}</p>
          </div>
        </div>
        <div>
          <ButtonLink href={href} variant="secondary" size="sm">
            {ctaLabel}
            <span className="sr-only">: {title}</span>
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

/** Figma "Resource Card", Size=SM: a square photo, topic and title, and on desktop an arrow cell. One link. */
export function ResourceCardSmall({ topic, title, href, image, sizes }: ResourceCardProps) {
  return (
    <Link href={href} className="group flex items-stretch text-primary-leather">
      <span className="relative block size-[6.5rem] shrink-0 overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:size-[8rem]">
        <Picture image={image} sizes={sizes} className="absolute inset-0 size-full object-cover" />
      </span>
      <span className="flex min-w-0 flex-1 items-stretch py-space-2 ui-desktop:py-space-4">
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-space-2 pl-space-4 ui-desktop:pr-space-8 ui-desktop:pl-space-6">
          <span className="type-overline-xs-medium">{topic}</span>
          <h3 className="type-heading-sm ui-transition-fast group-hover:text-black-alpha-60">{title}</h3>
        </span>
        <span className="hidden items-center border-l border-secondary-gold px-space-4 ui-desktop:flex">
          {/* Gold, as the Home Education Center rows (Figma 3565:101343). */}
          <Icon name="chevron-right" size={16} className="ui-transition-fast text-secondary-gold group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
