import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { RichText } from "@/components/ui/RichText";
import type { About as AboutContent } from "@/content/home";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/** Figma Home section 11: About Sky Jewelry, text beside a square photo (photo first on mobile). */
export function About({ content }: { content: AboutContent }) {
  const headingId = `${content._key}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={`site-container flex flex-col gap-space-8 text-primary-leather ui-desktop:flex-row ui-desktop:items-center ui-desktop:gap-space-17 ${SECTION_Y}`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-4 bg-secondary-ivory ui-desktop:order-2 ui-desktop:w-[49.04%] ui-desktop:shrink-0">
        <Picture image={content.image} sizes={{ desktop: "calc(49vw - 94px)", mobile: "calc(100vw - 40px)" }} className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col items-start gap-space-4 ui-desktop:gap-space-6 ui-desktop:py-space-10">
        <div className="flex flex-col gap-space-4">
          <h2 id={headingId} className={SECTION_HEADING}>
            <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className="type-body-sm-regular ui-desktop:type-body-md-regular">{content.body}</p>
        </div>
        <div className="ui-desktop:pt-space-2">
          <ButtonLink href={content.cta.href} variant="secondary" size="responsive">
            {content.cta.label}
            <span className="sr-only">: {content.cta.context}</span>
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
