import { ButtonLink, ButtonText } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { RichText } from "@/components/ui/RichText";
import type { HeroModule as HeroModuleContent } from "@/content/home";
import { LANDING_BUTTON, SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/** Figma "Hero Module": a full-bleed photo with a skin caption card sitting on its bottom edge. Used twice. */
export function HeroModule({ content }: { content: HeroModuleContent }) {
  const headingId = `${content._key}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={
        content.flushTop === "both"
          ? "pb-space-11 ui-desktop:pb-space-15"
          : content.flushTop === "desktop"
            ? "py-space-11 ui-desktop:pt-0 ui-desktop:pb-space-15"
            : content.flushTop === "mobile"
              ? "pb-space-11 ui-desktop:py-space-15"
              : SECTION_Y
      }
    >
      <div className="relative isolate flex h-[40rem] flex-col items-center justify-end overflow-hidden px-space-5 ui-desktop:h-[45.25rem] ui-desktop:px-0">
        <Picture image={content.image} sizes={{ desktop: "100vw", mobile: "100vw" }} className="absolute inset-0 -z-10 size-full object-cover" />
        <div className="flex w-full flex-col items-center gap-space-5 rounded-t-8 border-b border-secondary-skin bg-secondary-skin px-space-5 pt-space-8 text-center text-primary-leather ui-desktop:w-[38.375rem] ui-desktop:gap-space-8 ui-desktop:border-0 ui-desktop:px-space-13 ui-desktop:pt-space-13">
          <div className="flex flex-col items-center gap-space-3 ui-desktop:gap-space-8">
            {content.overline ? <p className="type-overline-xs-medium">{content.overline}</p> : null}
            <h2 id={headingId} className={SECTION_HEADING}>
              <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
            </h2>
          </div>
          <p className="type-body-xs-regular max-w-[28.75rem] ui-desktop:type-body-sm-regular">{content.body}</p>
          {content.inert ? (
            <ButtonText variant="secondary" size="responsive" className={content.landing ? LANDING_BUTTON : undefined}>
              {content.cta.label}
            </ButtonText>
          ) : (
            <ButtonLink href={content.cta.href} variant="secondary" size="responsive" className={content.landing ? LANDING_BUTTON : undefined}>
              {content.cta.label}
              <span className="sr-only">: {content.cta.context}</span>
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
