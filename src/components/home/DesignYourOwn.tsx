import { ButtonLink } from "@/components/ui/Button";
import { DyoCard } from "@/components/ui/DyoCard";
import { Picture } from "@/components/ui/Picture";
import { RichText } from "@/components/ui/RichText";
import type { DesignYourOwn as DesignYourOwnContent } from "@/content/home";

/**
 * Figma "Design Your Own". Desktop: a DYO Card on each side of the floating diamond and setting.
 * Mobile: the picture, a heading and body, and both buttons stacked. Figma has no visible heading on
 * desktop, so the mobile heading stays for screen readers there.
 *
 * Desktop photos scale with their column up to Figma's size at 1440 (diamond 119px, setting 372 x 421) and stay
 * there on wider screens: the picture column's height is fixed, so a larger setting photo spilled out of the
 * section and its fade hid the next section's heading (Task 32). The setting crop is 320 x 421, drawn contain in
 * that box, so the sizes values (320px, 119px) are exact from 1440 up and generous below it. The section clips
 * anything that would still reach past its bottom edge.
 */
export function DesignYourOwn({ content }: { content: DesignYourOwnContent }) {
  const [settingCard, stoneCard] = content.cards;

  return (
    <section aria-labelledby="dyo-heading" className="overflow-clip bg-secondary-skin">
      <div className="site-container flex flex-col items-center gap-space-6 py-space-11 text-center text-primary-leather ui-desktop:flex-row ui-desktop:py-[5.125rem]">
        <div className="order-2 flex flex-col gap-space-4 ui-desktop:contents">
          <h2 id="dyo-heading" className="type-heading-caps-lg ui-desktop:sr-only">
            <RichText value={content.heading} emClassName="type-heading-italic-lg" />
          </h2>
          <p className="type-body-md-regular ui-desktop:hidden">{content.body}</p>
        </div>

        <div className="hidden flex-1 ui-desktop:order-1 ui-desktop:block">
          <DyoCard {...settingCard} />
        </div>

        <div
          aria-hidden="true"
          className="relative order-1 h-[12.8125rem] w-[11.625rem] shrink-0 ui-desktop:order-2 ui-desktop:h-[26.75rem] ui-desktop:w-auto ui-desktop:flex-1"
        >
          <div className="absolute top-0 left-[4rem] w-[3.5625rem] ui-desktop:top-[0.875rem] ui-desktop:left-1/2 ui-desktop:w-[29.75%] ui-desktop:max-w-[7.4375rem] ui-desktop:-translate-x-1/2">
            <Picture image={content.diamond} sizes={{ desktop: "119px", mobile: "57px" }} className="aspect-[119/82] w-full object-cover" />
          </div>
          <div className="absolute top-[2.16rem] left-[0.25rem] w-[11.1875rem] ui-desktop:top-[5.375rem] ui-desktop:left-1/2 ui-desktop:w-[93%] ui-desktop:max-w-[23.25rem] ui-desktop:-translate-x-1/2">
            <Picture
              image={content.setting}
              sizes={{ desktop: "320px", mobile: "154px" }}
              className="aspect-[372/421] w-full object-contain object-bottom"
            />
            <span className="absolute inset-0 bg-linear-to-b from-secondary-skin/0 from-40% to-secondary-skin to-80%" />
          </div>
        </div>

        <div className="hidden flex-1 ui-desktop:order-3 ui-desktop:block">
          <DyoCard {...stoneCard} />
        </div>

        <div className="order-3 flex w-full flex-col gap-space-4 ui-desktop:hidden">
          {content.cards.map((card) => (
            <ButtonLink key={card._key} href={card.cta.href} variant="secondary" size="md" className="w-full">
              {card.cta.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
