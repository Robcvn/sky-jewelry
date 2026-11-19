import { Fragment } from "react";

/**
 * Inline rich text shaped like Sanity Portable Text spans. Headings in Figma set single words in the
 * italic heading style ("Design your ring *from* stone to setting"), and some mobile headings break a line.
 */
export type RichSpan = { _type: "span"; text: string; italic?: boolean } | { _type: "break"; mobileOnly?: boolean };

export const span = (text: string, italic = false): RichSpan => ({ _type: "span", text, italic });
export const em = (text: string): RichSpan => span(text, true);
export const br = (mobileOnly = false): RichSpan => ({ _type: "break", mobileOnly });

export const plainText = (value: RichSpan[]) =>
  value.map((part) => (part._type === "span" ? part.text : " ")).join("").replace(/\s+/g, " ").trim();

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
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
