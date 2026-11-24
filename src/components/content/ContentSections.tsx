import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Picture, type ImageRef } from "@/components/ui/Picture";
import { RichText, type RichSpan } from "@/components/ui/RichText";
import { TextButtonLink, TextButtonText } from "@/components/ui/TextButton";

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const formatDate = (iso: string) => DATE.format(new Date(iso));

/** The photo heroes' shade (Figma "Overlay": #1B1413 at 40%, from clear at 25% (mobile 0%) to full at 75%), as Home's hero. */
const SHADE = "absolute inset-0 bg-linear-to-b from-black-alpha-0 to-black-alpha-40 to-75% ui-desktop:from-25%";

/** The photo and its shade behind a hero's text, out of the flow (a <picture> would otherwise be a flex item). */
function HeroPhoto({ image }: { image: ImageRef }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Picture image={image} sizes={{ desktop: "100vw", mobile: "100vw" }} priority className="absolute inset-0 size-full object-cover" />
      <span aria-hidden="true" className={SHADE} />
    </div>
  );
}

/**
 * Education Center top (3565:101629, mobile 3587:129570). Desktop: the 1440 x 600 photo with the title (caps-3xl) and
 * line (body-lg) centred 80px from its foot. Mobile: no photo; the title (caps-lg) and line (body-sm) centred on the
 * page, with a 1px gold rule 24px under them (7117:90706; the resources follow 24px under the rule).
 */
export function EducationHero({ title, body, image }: { title: string; body: string; image: ImageRef }) {
  // One heading for both layouts: over the photo from 1024px, on the page below it.
  return (
    <header className="relative isolate text-primary-leather ui-desktop:flex ui-desktop:aspect-[1440/600] ui-desktop:items-end ui-desktop:justify-center ui-desktop:overflow-hidden">
      <div className="absolute inset-0 -z-10 hidden ui-desktop:block">
        <HeroPhoto image={image} />
      </div>
      <div className="site-container pt-space-11 ui-desktop:w-auto ui-desktop:max-w-[51.25rem] ui-desktop:px-space-6 ui-desktop:pt-0 ui-desktop:pb-space-15">
        <div className="flex flex-col items-center gap-space-3 border-b border-secondary-gold pb-[calc(var(--spacing-space-6)-1px)] text-center ui-desktop:gap-space-6 ui-desktop:border-b-0 ui-desktop:pb-0">
          <h1 className="type-heading-caps-lg ui-desktop:type-heading-caps-3xl ui-desktop:text-base-white">{title}</h1>
          <p className="type-body-sm-regular ui-desktop:type-body-lg-regular ui-desktop:max-w-[34.25rem] ui-desktop:text-secondary-ivory">{body}</p>
        </div>
      </div>
    </header>
  );
}

/**
 * Resource Detail top (3565:101773, mobile 3587:129748): the photo (1440 x 600; mobile 390 x 480) with "All Resources"
 * (Button - Overlay, XS) 48 / 24px from its top, then the topic (Text Button - Overlay, caps), the title (caps-3xl /
 * caps-xl) and the line (body-lg / body-sm), centred 80 / 48px from its foot.
 */
export function ResourceHero({ title, body, topic, image, back }: { title: string; body: string; topic: { label: string; href: string }; image: ImageRef; back: { label: string; href: string } }) {
  return (
    <header className="relative isolate flex aspect-[390/480] flex-col items-center justify-between overflow-hidden px-space-5 pt-space-6 pb-space-11 text-center ui-desktop:aspect-[1440/600] ui-desktop:pt-space-11 ui-desktop:pb-space-15">
      <HeroPhoto image={image} />
      <ButtonLink href={back.href} overlay size="xs" leftIcon="arrow-left">
        {back.label}
      </ButtonLink>
      <div className="flex max-w-[51.25rem] flex-col items-center">
        <TextButtonLink href={topic.href} overlay size="sm" variant="caps">
          {topic.label}
        </TextButtonLink>
        <h1 className="type-heading-caps-xl mt-space-4 text-base-white ui-desktop:type-heading-caps-3xl ui-desktop:mt-space-6">{title}</h1>
        <p className="type-body-sm-regular mt-space-4 max-w-[25rem] text-secondary-ivory ui-desktop:type-body-lg-regular ui-desktop:mt-space-6">{body}</p>
      </div>
    </header>
  );
}

/**
 * Post Detail top (3565:102017, mobile 3587:130026): "All Posts" (Text Button, caps, Arrow Left), the topic, the title
 * (caps-2xl, 820 wide; mobile caps-lg), the date and read time, then the 1034 x 581 photo (mobile 4:3, full width).
 */
export function PostHeader({ title, topic, date, readTime, image, back }: { title: string; topic: { label: string; href?: string }; date?: string; readTime?: string; image: ImageRef; back: { label: string; href: string } }) {
  // A story (Figma "Post Detail / Stories" 6287:176402) has an eyebrow with no destination ("Meet the Couple", inert)
  // and no date line: the photo sits 48px under the title, as the date line's photo does.
  return (
    <header className="site-container flex flex-col items-center pt-space-11 text-center text-primary-leather ui-desktop:pt-space-15">
      <TextButtonLink href={back.href} size="sm" variant="caps" leadingIcon="arrow-left">
        {back.label}
      </TextButtonLink>
      {topic.href ? (
        <TextButtonLink href={topic.href} size="sm" variant="caps" className="mt-space-8 ui-desktop:mt-space-11">
          {topic.label}
        </TextButtonLink>
      ) : (
        <TextButtonText size="sm" variant="caps" className="mt-space-8 ui-desktop:mt-space-11">
          {topic.label}
        </TextButtonText>
      )}
      <h1 className="type-heading-caps-lg mt-space-4 max-w-[51.25rem] ui-desktop:type-heading-caps-2xl">{title}</h1>
      {date ? (
        // Figma: the date line in black-alpha-50 (3565:102017, 3587:130026; Task 30, post-1440-1).
        <p className="type-overline-xs-medium mt-space-4 flex items-center gap-space-4 text-black-alpha-50">
          <time dateTime={date}>{formatDate(date)}</time>
          <span aria-hidden="true" className="h-3.5 w-px bg-black-alpha-20" />
          <span>{readTime}</span>
        </p>
      ) : null}
      <div className="relative mt-space-8 aspect-[4/3] w-full overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:mt-space-11 ui-desktop:aspect-[1034/581] ui-desktop:w-[82.85%]">
        <Picture image={image} sizes={{ desktop: "(width >= 90rem) 64.625rem, 72vw", mobile: "calc(100vw - 40px)" }} priority className="absolute inset-0 size-full object-cover" />
      </div>
    </header>
  );
}

/**
 * "Next Resource" (3565:101773): a 293px square photo beside the overline, title (heading-lg), summary (body-md) and
 * "Read Now", centred on the photo. Mobile: the photo full width (350) with the text under it.
 */
export function NextResource({ label, title, body, href, image, cta }: { label: string; title: string; body: string; href: string; image: ImageRef; cta: string }) {
  return (
    <section aria-label={label} className="flex flex-col gap-space-6 text-primary-leather ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-10">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-square w-full shrink-0 overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:w-[35.6%]">
        <Picture image={image} sizes={{ desktop: "(width >= 90rem) 18.3rem, 21vw", mobile: "calc(100vw - 40px)" }} className="absolute inset-0 size-full object-cover" />
      </Link>
      <div className="flex flex-col items-start">
        <p className="type-overline-xs-medium">{label}</p>
        <h2 className="type-heading-lg mt-space-2">
          <Link href={href} className="ui-transition-fast hover:text-black-alpha-60">
            {title}
          </Link>
        </h2>
        <p className="type-body-md-regular mt-space-4">{body}</p>
        <TextButtonLink href={href} size="sm" variant="caps" trailingIcon="chevron-right" className="mt-space-6" aria-label={`${cta}: ${title}`}>
          {cta}
        </TextButtonLink>
      </div>
    </section>
  );
}

/**
 * The Blog List's featured post (3565:101703, mobile 3587:129657): the 584 x 438 photo beside the topic, date and read
 * time, title (heading-lg), excerpt and "Read More" (Button, Secondary, MD), centred on the photo. Mobile: stacked, no topic.
 */
export function FeaturedPost({ title, excerpt, topic, date, readTime, href, image, cta }: { title: string; excerpt: string; topic: string; date: string; readTime: string; href: string; image: ImageRef; cta: string }) {
  return (
    <article className="flex flex-col gap-space-4 text-primary-leather ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-15">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:w-[46.8%]">
        <Picture image={image} sizes={{ desktop: "(width >= 90rem) 36.5rem, 41vw", mobile: "calc(100vw - 40px)" }} priority className="absolute inset-0 size-full object-cover" />
      </Link>
      <div className="flex flex-col items-start">
        <p className="type-overline-xs-medium flex flex-wrap items-center gap-space-2 text-black-alpha-60">
          <span className="hidden ui-desktop:inline">{topic}</span>
          <span aria-hidden="true" className="hidden h-2.5 w-px bg-black-alpha-20 ui-desktop:inline-block" />
          <time dateTime={date}>{formatDate(date)}</time>
          <span aria-hidden="true" className="h-2.5 w-px bg-black-alpha-20" />
          <span>{readTime}</span>
        </p>
        <h2 className="type-heading-md mt-space-2 ui-desktop:type-heading-lg ui-desktop:mt-space-4">
          <Link href={href} className="ui-transition-fast hover:text-black-alpha-60">
            {title}
          </Link>
        </h2>
        <p className="type-body-xs-regular mt-space-3 max-w-[35rem] ui-desktop:type-body-sm-regular ui-desktop:mt-space-4">{excerpt}</p>
        <ButtonLink href={href} variant="secondary" size="responsive" className="mt-space-4 ui-desktop:mt-space-6" aria-label={`${cta}: ${title}`}>
          {cta}
        </ButtonLink>
      </div>
    </article>
  );
}

/**
 * A photo hero with the page's title and a line, centred on the photo (Sky Guarantee 3565:101916: 1440 x 756, caps-3xl
 * with an italic word, body-lg; mobile 3587:129907: 390 x 480, caps-xl, body-sm). `title` may differ per breakpoint.
 */
export function TitleHero({ title, body, image }: { title: { desktop: RichSpan[]; mobile: RichSpan[] }; body: string; image: ImageRef }) {
  return (
    <header className="relative isolate flex aspect-[390/480] items-center justify-center overflow-hidden px-space-5 text-center ui-desktop:aspect-[1440/756]">
      <HeroPhoto image={image} />
      <div className="flex max-w-[51.25rem] flex-col items-center gap-space-4 ui-desktop:gap-space-10">
        <h1 className="type-heading-caps-xl text-base-white ui-desktop:type-heading-caps-3xl">
          <span className="ui-desktop:hidden">
            <RichText value={title.mobile} emClassName="type-heading-italic-xl" />
          </span>
          <span className="hidden ui-desktop:inline">
            {/* Figma breaks the desktop title before its italic word ("SKY JEWELRY" / "Support", 820 x 144). */}
            <RichText value={title.desktop} emClassName="type-heading-italic-3xl block" />
          </span>
        </h1>
        <p className="type-body-sm-regular max-w-[25rem] text-secondary-ivory ui-desktop:type-body-lg-regular">{body}</p>
      </div>
    </header>
  );
}
