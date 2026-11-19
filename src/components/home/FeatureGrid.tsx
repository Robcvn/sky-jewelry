import { FeatureCard } from "@/components/ui/FeatureCard";
import type { FeatureGrid as FeatureGridContent } from "@/content/home";

/** Figma Home section 4: five Feature Cards, a wide one first. 3 columns on desktop, 2 on mobile. */
export function FeatureGrid({ content }: { content: FeatureGridContent }) {
  return (
    <section aria-labelledby="features-heading" className={`site-container py-space-11 ui-desktop:pb-space-15 ${content.padTop ? "ui-desktop:pt-space-15" : "ui-desktop:pt-0"}`}>
      <h2 id="features-heading" className="sr-only">
        {content.heading}
      </h2>
      <ul className="grid grid-cols-2 gap-space-2 ui-desktop:grid-cols-3 ui-desktop:gap-space-6">
        {content.cards.map((card) => (
          <li key={card._key} className={card.wide ? "col-span-2 aspect-[350/360] ui-desktop:aspect-auto" : "aspect-[4/5]"}>
            <FeatureCard
              title={card.title}
              ctaLabel={content.ctaLabel}
              href={card.href}
              image={card.image}
              sizes={card.wide ? { desktop: "calc(66vw - 64px)", mobile: "calc(100vw - 40px)" } : { desktop: "calc(33vw - 80px)", mobile: "calc(50vw - 24px)" }}
              className="size-full"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
