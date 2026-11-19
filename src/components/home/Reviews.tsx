import { Carousel } from "@/components/ui/Carousel";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { RichText, plainText } from "@/components/ui/RichText";
import { StarRating } from "@/components/ui/StarRating";
import type { Reviews as ReviewsContent } from "@/content/home";
import { SECTION_HEADING_EM, SECTION_Y } from "./styles";

/** Figma Home section 9: client reviews on leather. Three cards in a row on desktop, swipeable on mobile. */
export function Reviews({ content }: { content: ReviewsContent }) {
  const headingId = `${content._key}-heading`;

  return (
    <section aria-labelledby={headingId} className={`flex flex-col gap-space-8 bg-primary-leather ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <div className="site-container flex flex-col items-center gap-space-4 text-center ui-desktop:flex-row ui-desktop:justify-between ui-desktop:text-left">
        <h2 id={headingId} className="type-heading-caps-lg text-base-white ui-desktop:type-heading-caps-xl">
          <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
        </h2>
        <div className="flex items-center gap-space-4">
          <p aria-hidden="true" className="type-body-2xl-medium text-base-white">
            {content.rating}
          </p>
          <div className="flex flex-col gap-space-1">
            <StarRating rating={content.rating} />
            <p className="type-body-xs-medium text-secondary-skin">{content.reviewCount}</p>
          </div>
        </div>
      </div>
      <Carousel
        label={plainText(content.heading)}
        desktop="grid"
        gridClassName="ui-desktop:grid-cols-3"
        overlay
        itemClassName="w-[18rem] ui-desktop:w-auto"
        items={content.reviews.map((review) => ({ key: review._key, node: <ReviewCard {...review} /> }))}
      />
    </section>
  );
}
