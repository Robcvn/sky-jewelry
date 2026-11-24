import { ButtonLink } from "@/components/ui/Button";
import { ResourceCardLarge, ResourceCardSmall } from "@/components/ui/ResourceCard";
import { RichText } from "@/components/ui/RichText";
import type { EducationCenter as EducationCenterContent } from "@/content/home";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/**
 * Figma Home section 8: Education Center, one large Resource Card beside four small ones. The Education Center page's
 * "Featured Education" (3565:101629, mobile 3587:129570) is the same block with `page`: a larger heading (caps-2xl) and
 * body (body-lg), centred at both widths (the frames' text boxes span the column, centre-aligned), 24px above the
 * cards on mobile, and no "view all" button.
 */
export function EducationCenter({ content, variant = "home" }: { content: EducationCenterContent; variant?: "home" | "page" | "support" }) {
  // "support": the support page's Education block (Sky Guarantee 3565:102003 / 3587:130009): Home's block on a
  // secondary/ivory band, with the caps heading (heading-caps-lg / heading-caps-xl), 24px above the cards on mobile.
  const page = variant === "page";
  const support = variant === "support";
  const compact = variant !== "home";
  const headingId = `${content._key}-heading`;
  const viewAll = page ? null : (
    <ButtonLink href={content.cta.href} variant="secondary" size="sm">
      {content.cta.label}
    </ButtonLink>
  );

  const block = (
    <>
      <div
        className={`flex flex-col items-center gap-space-3 border-b border-secondary-gold pb-space-6 text-center text-primary-leather ui-desktop:pb-space-10 ${page ? "" : "ui-desktop:flex-row ui-desktop:items-end ui-desktop:justify-between ui-desktop:gap-space-2 ui-desktop:text-left"}`}
      >
        <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
          <h2 id={headingId} className={page ? "type-heading-caps-lg ui-desktop:type-heading-caps-2xl" : support ? "type-heading-caps-lg ui-desktop:type-heading-caps-xl" : SECTION_HEADING}>
            <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className={page ? "type-body-sm-regular ui-desktop:type-body-lg-regular" : "type-body-sm-regular ui-desktop:type-body-md-regular"}>{content.body}</p>
        </div>
        {viewAll ? <div className="hidden shrink-0 ui-desktop:block">{viewAll}</div> : null}
      </div>
      <div className="flex flex-col gap-space-8 ui-desktop:grid ui-desktop:grid-cols-[718fr_506fr] ui-desktop:items-start ui-desktop:gap-space-6">
        <ResourceCardLarge
          {...content.featured}
          sizes={{ desktop: "calc(50vw - 40px)", mobile: "calc(100vw - 40px)" }}
        />
        <ul className="flex flex-col gap-space-4 ui-desktop:gap-space-6">
          {content.resources.map((resource) => (
            <li key={resource._key}>
              <ResourceCardSmall {...resource} sizes={{ desktop: "128px", mobile: "104px" }} />
            </li>
          ))}
        </ul>
      </div>

      {/* 40px under the cards on mobile, on Home (gap 32 + 8) and on the support page (gap 24 + 16; 3587:129907). */}
      {viewAll ? <div className={`flex justify-center ui-desktop:hidden ${compact ? "pt-space-4" : "pt-space-2"}`}>{viewAll}</div> : null}
    </>
  );

  const stack = `flex flex-col ui-desktop:gap-space-11 ${compact ? "gap-space-6" : "gap-space-8"}`;
  if (support) {
    return (
      <section aria-labelledby={headingId} className={`bg-secondary-ivory ${SECTION_Y}`}>
        <div className={`site-container ${stack}`}>{block}</div>
      </section>
    );
  }
  return (
    <section aria-labelledby={headingId} className={`site-container ${stack} ${page ? "" : SECTION_Y}`}>
      {block}
    </section>
  );
}
