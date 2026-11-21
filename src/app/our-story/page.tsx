import type { Metadata } from "next";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "@/components/home/styles";
import { BestSellersSection } from "@/components/sections/BestSellers";
import { ButtonText, HeroButtonText } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { RichText } from "@/components/ui/RichText";
import { cx, withBasePath } from "@/components/ui/shared";
import { contentBestSellers } from "@/content/education";
import { ourStoryPage as page } from "@/content/our-story";

export const metadata: Metadata = { title: page.seo.title, description: page.seo.description, alternates: { canonical: withBasePath("/our-story/") } };

const SQUARE = "relative aspect-square w-full overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:w-[49.04%] ui-desktop:shrink-0";
const SQUARE_SIZES = { desktop: "(width >= 90rem) 38.25rem, 42vw", mobile: "calc(100vw - 40px)" };

/**
 * Our Story (Figma 5110:36289; no mobile frame, so mobile follows the patterns these blocks already use: Home's hero,
 * Home's About block and the landing pages' section spacing; see Deviations).
 * Desktop: the photo hero (1440 x 756) with the overline, the title and one full-width Hero Button - Overlay at its foot;
 * two text-and-square-photo sections (photo right, then left; 96 apart); The Foundations; the best sellers.
 */
export default function OurStoryPage() {
  const { hero, business, apart, foundations } = page;
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Home's hero pattern: 640 tall on mobile, 756 on desktop; the 40% shade from 25% down. */}
      <section aria-labelledby="our-story-heading" className="relative isolate h-[40rem] overflow-hidden ui-desktop:h-[47.25rem]">
        <Picture image={hero.image} sizes={{ desktop: "100vw", mobile: "100vw" }} priority className="absolute inset-0 -z-10 size-full object-cover" />
        <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-black-alpha-0 to-black-alpha-40 to-75% ui-desktop:from-25%" />
        <div className="absolute inset-x-0 bottom-[12.25rem] flex flex-col items-center gap-space-4 px-space-5 text-center ui-desktop:bottom-[17.25rem] ui-desktop:gap-space-10">
          <p className="type-overline-sm-medium max-w-[25rem] text-secondary-ivory ui-desktop:type-overline-md-medium">{hero.overline}</p>
          <h1 id="our-story-heading" className="type-heading-caps-xl max-w-[51.25rem] text-base-white ui-desktop:type-heading-caps-3xl">
            <RichText value={hero.title} emClassName="type-heading-italic-xl ui-desktop:type-heading-italic-3xl" />
          </h1>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex">
          <HeroButtonText icon={hero.button.icon} size="sm" className="ui-desktop:hidden">
            {hero.button.label}
          </HeroButtonText>
          <HeroButtonText icon={hero.button.icon} className="hidden ui-desktop:flex">
            {hero.button.label}
          </HeroButtonText>
        </div>
      </section>

      {/* Home's About pattern: photo first on mobile; text beside the 612 square on desktop, centred on it. */}
      <section aria-labelledby="business-heading" className={cx("site-container flex flex-col gap-space-8 text-primary-leather ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-17", SECTION_Y)}>
        <div className={cx(SQUARE, "ui-desktop:order-2")}>
          <Picture image={business.image} sizes={SQUARE_SIZES} className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col items-start">
          <h2 id="business-heading" className={SECTION_HEADING}>
            <RichText value={business.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className="type-p-md-regular mt-space-4 ui-desktop:type-p-lg-regular">{business.body}</p>
          <div className="mt-space-6 flex flex-wrap gap-space-3 ui-desktop:mt-space-8">
            {business.buttons.map((label, index) => (
              <ButtonText key={index} variant="secondary" size="responsive">
                {label}
              </ButtonText>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="apart-heading" className={cx("site-container flex flex-col gap-space-8 text-primary-leather ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-17", SECTION_Y)}>
        <div className={SQUARE}>
          <Picture image={apart.image} sizes={SQUARE_SIZES} className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col items-start">
          <h2 id="apart-heading" className={SECTION_HEADING}>
            <RichText value={apart.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className="type-p-md-regular mt-space-4 ui-desktop:type-p-lg-regular">{apart.body}</p>
          <dl className="mt-space-10 flex flex-col gap-space-6 ui-desktop:mt-space-15">
            {apart.items.map((item) => (
              <div key={item._key} className="flex flex-col gap-space-4">
                <dt className="type-overline-sm-medium ui-desktop:type-overline-md-medium">{item.label}</dt>
                <dd className="type-p-md-regular ui-desktop:type-p-lg-regular">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="foundations-heading" className={cx("site-container flex flex-col gap-space-6 text-primary-leather ui-desktop:gap-space-7", SECTION_Y)}>
        <p className="type-overline-sm-medium ui-desktop:type-overline-md-medium">{foundations.overline}</p>
        <h2 id="foundations-heading" className="type-heading-lg max-w-[72rem] ui-desktop:type-heading-2xl">
          {foundations.statement}
        </h2>
      </section>

      <BestSellersSection content={contentBestSellers} />
    </main>
  );
}
