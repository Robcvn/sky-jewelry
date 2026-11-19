import { ButtonLink, ButtonText } from "./Button";
import { Picture, type ImageRef } from "./Picture";
import { cx } from "./shared";

type ButtonCardProps = {
  title: string;
  body: string;
  cta: { label: string; href: string; inert?: boolean };
  image: ImageRef;
  sizes: { desktop: string; mobile: string };
  /** h3 by default; h2 when the cards stand without a section heading. */
  headingLevel?: 2 | 3;
  /** Mobile overlay strength: "strong" 50% (product page frame) or "soft" 30% (landing page frames). */
  mobileOverlay?: "strong" | "soft";
  className?: string;
};

/**
 * Figma "Button Card": a photo with a dark gradient from the middle down, a centred title and line of text
 * in skin with a soft text shadow, and a "Button - Overlay" (secondary) at the bottom.
 * Desktop 612 x 500 (title heading-lg, button 56px, min 200 wide); mobile 350 x 438 (heading-sm, 40px, min 160).
 * Overlay as Figma: black 0% at 25% to 30% at 75% on desktop, 50% on mobile. (Figma's second desktop card uses
 * the hover strength, 40%, in its default state; built at 30% like the first.)
 */
export function ButtonCard({ title, body, cta, image, sizes, headingLevel = 3, mobileOverlay = "strong", className }: ButtonCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={cx(
        "relative isolate flex flex-col items-center justify-end overflow-hidden rounded-4 bg-secondary-ivory px-space-5 py-space-6 text-center text-secondary-skin ui-desktop:px-space-6 ui-desktop:py-space-10",
        className,
      )}
    >
      <Picture image={image} sizes={sizes} className="absolute inset-0 -z-10 size-full object-cover" />
      <span
        aria-hidden="true"
        className={cx(
          "absolute inset-0 -z-10 ui-desktop:bg-[linear-gradient(180deg,transparent_25%,var(--color-black-alpha-30)_75%)]",
          mobileOverlay === "soft"
            ? "bg-[linear-gradient(180deg,transparent_25%,var(--color-black-alpha-30)_75%)]"
            : "bg-[linear-gradient(180deg,transparent_25%,var(--color-black-alpha-50)_75%)]",
        )}
      />
      <div className="flex w-full flex-col items-center gap-space-1 py-space-4 ui-desktop:max-w-[30rem] ui-desktop:gap-space-2 ui-desktop:py-space-6">
        <Heading className="type-heading-sm [text-shadow:0_0_24px_var(--color-black-alpha-50)] ui-desktop:type-heading-lg">{title}</Heading>
        <p className="type-body-xs-regular max-w-[25rem] [text-shadow:0_0_16px_var(--color-black-alpha-50)] ui-desktop:type-body-sm-regular">{body}</p>
      </div>
      {cta.inert ? (
        <ButtonText overlay variant="secondary" size="responsive" className="min-w-40 ui-desktop:min-w-50">
          {cta.label}
        </ButtonText>
      ) : (
        <ButtonLink href={cta.href} overlay variant="secondary" size="responsive" className="min-w-40 ui-desktop:min-w-50">
          {cta.label}
        </ButtonLink>
      )}
    </article>
  );
}
