import { HeroButton } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { RichText } from "@/components/ui/RichText";
import type { HomeHero as HomeHeroContent } from "@/content/home";

/** Figma Home "Hero": full-bleed photo, centred caption with the page's h1, and two large links. */
export function HomeHero({ content }: { content: HomeHeroContent }) {
  return (
    <section aria-labelledby="home-hero-heading" className="relative isolate h-[40rem] overflow-hidden ui-desktop:h-[47.25rem]">
      <Picture image={content.image} sizes={{ desktop: "100vw", mobile: "100vw" }} priority className="absolute inset-0 -z-10 size-full object-cover" />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-black-alpha-0 to-black-alpha-40 to-75% ui-desktop:from-25%" />

      <div className="absolute inset-x-0 bottom-[12.25rem] flex flex-col items-center gap-space-4 px-space-5 text-center ui-desktop:bottom-[14rem] ui-desktop:gap-space-10">
        <p className="type-overline-sm-medium max-w-[25rem] text-secondary-ivory text-shadow-sm ui-desktop:type-overline-md-medium ui-desktop:text-shadow-none">
          {content.overline}
        </p>
        <h1
          id="home-hero-heading"
          className="type-heading-caps-xl max-w-[51.25rem] text-base-white text-shadow-lg ui-desktop:type-heading-caps-3xl ui-desktop:text-shadow-none"
        >
          <RichText value={content.heading} emClassName="type-heading-italic-xl ui-desktop:type-heading-italic-3xl" />
        </h1>
        <p className="type-body-md-regular max-w-[25rem] text-secondary-ivory text-shadow-sm ui-desktop:type-body-lg-regular ui-desktop:text-shadow-none">
          {content.body}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex">
        {content.links.map((link, index) => (
          <div key={link._key} className="relative flex flex-1">
            {index > 0 ? <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-white-alpha-20" /> : null}
            <div className="flex flex-1 ui-desktop:hidden">
              <HeroButton href={link.href} icon={link.icon} overlay size="sm">
                {link.mobileLabel}
              </HeroButton>
            </div>
            <div className="hidden flex-1 ui-desktop:flex">
              <HeroButton href={link.href} icon={link.icon} overlay size="lg">
                {link.label}
              </HeroButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
