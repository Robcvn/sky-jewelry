import { Fragment } from "react";

/**
 * Inline rich text shaped like Sanity Portable Text spans. Headings in Figma set single words in the
 * italic heading style ("Design your ring *from* stone to setting"), and some mobile headings break a line.
 */
export type RichSpan =
  | {
      _type: "span";
      text: string;
      italic?: boolean;
      /**
       * Words that one breakpoint's frame has and the other's doesn't (Fine Jewelry's h1 ends "by Sky" on desktop
       * and "by Sky Jewelry" on mobile). The text appears once in the page and is hidden, from screen readers too,
       * on the other breakpoint.
       */
      mobileOnly?: boolean;
      /** Shown on desktop only: the desktop frame's wording where the mobile frame words it differently. */
      desktopOnly?: boolean;
      /** The mobile alternative to a desktopOnly span: left out of plainText so labels read the words once. */
      alternative?: boolean;
    }
  | { _type: "break"; mobileOnly?: boolean };

export const span = (text: string, italic = false): RichSpan => ({ _type: "span", text, italic });
export const em = (text: string): RichSpan => span(text, true);
export const mobileOnlySpan = (text: string): RichSpan => ({ _type: "span", text, mobileOnly: true });
export const br = (mobileOnly = false): RichSpan => ({ _type: "break", mobileOnly });
/** Words each breakpoint's frame has its own way (Gemstones: "Birthstone" on desktop, "Gemstones" on mobile). */
export const perBreakpoint = (desktop: string, mobile: string): RichSpan[] => [
  { _type: "span", text: desktop, desktopOnly: true },
  { _type: "span", text: mobile, mobileOnly: true, alternative: true },
];

export const plainText = (value: RichSpan[]) =>
  value
    .filter((part) => !(part._type === "span" && part.alternative))
    .map((part) => (part._type === "span" ? part.text : " "))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

/** emClassName is the matching Typography italic style, e.g. "type-heading-italic-lg ui-desktop:type-heading-italic-xl". */
export function RichText({ value, emClassName }: { value: RichSpan[]; emClassName: string }) {
  return (
    <>
      {value.map((part, index) =>
        part._type === "break" ? (
          <br key={index} className={part.mobileOnly ? "ui-desktop:hidden" : undefined} />
        ) : part.italic ? (
          <em key={index} className={`${emClassName} normal-case`}>
            {part.text}
          </em>
        ) : part.mobileOnly ? (
          <span key={index} className="ui-desktop:hidden">
            {part.text}
          </span>
        ) : part.desktopOnly ? (
          <span key={index} className="hidden ui-desktop:inline">
            {part.text}
          </span>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
