import { SECTION_HEADING, SECTION_HEADING_EM } from "@/components/home/styles";
import { RichText, type RichSpan } from "@/components/ui/RichText";

/** Desktop card width for four cards across the content width (the landing carousels and rows). */
export const CARD_W = "(100cqw - 2 * var(--grid-margin) - 3 * var(--spacing-space-6)) / 4";
export const CARD_ITEM = "w-[18.125rem] ui-desktop:w-[calc((100cqw-2*var(--grid-margin)-3*var(--spacing-space-6))/4)]";

/**
 * The landing pages' standard heading block: optional overline (10/14 mobile, 12/16 desktop; `overlineSize="sm"`
 * for 12/16 at both, as the Guarantee section), the section h2 (caps-lg / caps-xl, one italic word) and an
 * optional body line, centred. The overline gets one type class per breakpoint: two competing classes on one
 * element resolve by stylesheet order, not by the order they are written.
 */
export function SectionHeading({
  id,
  overline,
  heading,
  body,
  overlineSize = "responsive",
}: {
  id: string;
  overline?: string;
  heading: RichSpan[];
  body?: string;
  overlineSize?: "responsive" | "sm";
}) {
  return (
    <div className="site-container flex flex-col items-center gap-space-3 text-center text-primary-leather ui-desktop:gap-space-4">
      {overline ? (
        <p className={overlineSize === "sm" ? "type-overline-sm-medium" : "type-overline-xs-medium ui-desktop:type-overline-sm-medium"}>{overline}</p>
      ) : null}
      <h2 id={id} className={`max-w-[51.5rem] ${SECTION_HEADING}`}>
        <RichText value={heading} emClassName={SECTION_HEADING_EM} />
      </h2>
      {body ? <p className="type-p-sm-regular max-w-[51.5rem] ui-desktop:type-p-lg-regular">{body}</p> : null}
    </div>
  );
}

/** Section spacing on the landing pages: 48/80 padding, 24/48 from the heading to the content. */
export const LANDING_SECTION = "flex flex-col gap-space-6 py-space-11 ui-desktop:gap-space-11 ui-desktop:py-space-15";
