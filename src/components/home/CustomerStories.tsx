import { ButtonLink } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { RichText, plainText } from "@/components/ui/RichText";
import type { CustomerStories as CustomerStoriesContent } from "@/content/home";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/** Figma Home section 7: Customer Stories, a carousel of Feature Cards with a body line. */
export function CustomerStories({ content }: { content: CustomerStoriesContent }) {
  const headingId = `${content._key}-heading`;
  const viewAll = (
    <ButtonLink href={content.cta.href} variant="secondary" size="sm">
      {content.cta.label}
    </ButtonLink>
  );

  return (
    <section aria-labelledby={headingId} className={`flex flex-col gap-space-6 ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <div className="site-container flex items-end justify-center gap-space-6 ui-desktop:justify-between">
        <h2 id={headingId} className={`${SECTION_HEADING} text-center ui-desktop:text-left`}>
          <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
        </h2>
        <div className="hidden ui-desktop:block">{viewAll}</div>
      </div>
      <Carousel
        label={plainText(content.heading)}
        itemClassName="w-[18rem] ui-desktop:w-[calc((100cqw-2*var(--grid-margin)-2*var(--spacing-space-6))/3)]"
        items={content.stories.map((story) => ({
          key: story._key,
          node: (
            <FeatureCard
              title={story.title}
              body={story.body}
              ctaLabel={content.storyCtaLabel}
              href={story.href}
              image={story.image}
              sizes={{ desktop: "calc(33vw - 80px)", mobile: "288px" }}
              className="aspect-[4/5] w-full"
            />
          ),
        }))}
      />
      <div className="flex justify-center pt-space-2 ui-desktop:hidden">{viewAll}</div>
    </section>
  );
}
