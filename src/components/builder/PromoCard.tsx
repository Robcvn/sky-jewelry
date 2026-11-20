import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import type { PromoCard as PromoCardContent } from "@/content/builder";

type PromoCardProps = {
  promo: PromoCardContent;
  /** Which frame's card this is: desktop (300 x 400, or 616 x 400 when wide) or mobile (171 x 264, or 350 x 228 when wide). */
  breakpoint: "desktop" | "mobile";
  className?: string;
};

/**
 * Figma "Promo Card" in the builder's setting grid (desktop 3565:101315 and the two-column 3565:101324; mobile
 * 3587:125332 and the full-width 3587:125339): a photo under a black gradient, a caps headline, a line of body
 * copy and an overlay button, all bottom-centred. The text sits on the photo as Figma draws it.
 */
export function PromoCard({ promo, breakpoint, className }: PromoCardProps) {
  const desktop = breakpoint === "desktop";
  const wide = promo.width[breakpoint] === "wide";
  return (
    <article
      className={cx(
        "relative flex-col justify-end overflow-hidden rounded-4 bg-primary-leather text-center text-base-white",
        desktop ? "h-100" : wide ? "h-57" : "h-66",
        className,
      )}
    >
      <Picture
        image={promo.image}
        sizes={{ desktop: wide ? "(width >= 90rem) 38.5rem, 43vw" : "(width >= 90rem) 18.75rem, 21vw", mobile: wide ? "calc(100vw - 2.5rem)" : "45vw" }}
        className={cx("absolute inset-0 size-full object-cover", wide && "object-bottom")}
      />
      <span
        aria-hidden="true"
        className={cx(
          "absolute inset-0 bg-linear-to-b from-transparent from-25%",
          wide ? "to-black/40 to-75%" : "to-black/30 to-[67.75%]",
        )}
      />
      <div className={cx("relative flex flex-col items-center", desktop ? (wide ? "gap-space-4 p-space-6" : "gap-space-4 px-space-4 py-space-6") : "gap-space-3 p-space-3")}>
        <div className={cx("flex flex-col items-center", desktop ? "gap-space-2" : "gap-space-1", wide && desktop && "max-w-100")}>
          <h3 className={desktop ? (wide ? "type-heading-caps-md" : "type-heading-caps-sm") : "type-heading-caps-xs"}>{promo.title}</h3>
          <p className={cx("text-secondary-ivory", desktop ? (wide ? "type-body-sm-regular" : "type-body-xs-regular") : "type-body-2xs-regular")}>{promo.body}</p>
        </div>
        <ButtonLink href={promo.cta.href} size={desktop ? "sm" : "xs"} variant="secondary" overlay>
          {promo.cta.label}
          <span className="sr-only">: {promo.title}</span>
        </ButtonLink>
      </div>
    </article>
  );
}
