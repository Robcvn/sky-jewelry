import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "@/components/home/styles";
import { ButtonCard } from "@/components/ui/ButtonCard";
import { Carousel } from "@/components/ui/Carousel";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { QualityCard } from "@/components/ui/QualityCard";
import { RichText, plainText } from "@/components/ui/RichText";
import type { DiamondGrades } from "@/content/product-detail";
import { gradeScales, productDetailContent } from "@/content/product-detail";

const content = productDetailContent;

/**
 * "Your Diamond's Qualities" (Figma 3565:98439 / 3587:127242): Color, Clarity and Cut cards, three in a row
 * on desktop, a swipe row with the scrollbar on mobile. Grades are sample data (see product-detail.ts).
 */
export function DiamondQualities({ grades }: { grades: DiamondGrades }) {
  const cards = (["color", "clarity", "cut"] as const).map((key) => {
    const scale = gradeScales[key];
    const grade = grades[key];
    return { key, scale, grade, description: scale.grades[grade]?.description ?? "" };
  });
  return (
    <section aria-labelledby="pdp-qualities" className={`flex flex-col gap-space-6 bg-secondary-skin ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <h2 id="pdp-qualities" className={`site-container text-center ${SECTION_HEADING}`}>
        <RichText value={content.qualitiesHeading} emClassName={SECTION_HEADING_EM} />
      </h2>
      <Carousel
        label={plainText(content.qualitiesHeading)}
        desktop="grid"
        gridClassName="ui-desktop:grid-cols-3"
        itemClassName="w-[18rem] ui-desktop:w-auto"
        items={cards.map(({ key, scale, grade, description }) => ({
          key,
          node: <QualityCard title={scale.title} grade={grade} options={scale.options} illustration={scale.illustration} description={description} />,
        }))}
      />
    </section>
  );
}

/** "What's in the Box" (Figma 3565:98672 / 3587:127478): Image Blocks in a carousel, alternating widths on desktop. */
export function WhatsInTheBox() {
  const { heading, items } = content.box;
  return (
    <section aria-labelledby="pdp-box" className={`flex flex-col gap-space-6 ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <h2 id="pdp-box" className={`site-container text-center ${SECTION_HEADING}`}>
        <RichText value={heading} emClassName={SECTION_HEADING_EM} />
      </h2>
      {/* Figma at 1440: 400 x 400 and 612 x 400 photos in the 1248px content width. The carousel is a full-bleed size
          container, so sizes are fractions of (100cqw - 2 * grid margin), as the other carousels do. */}
      <Carousel
        label={plainText(heading)}
        arrowTop="calc((100cqw - 2 * var(--grid-margin)) * 200 / 1248)"
        itemClassName="w-[18rem] ui-desktop:w-auto"
        items={items.map((item) => ({
          key: item._key,
          node: (
            <ImageBlock
              image={item.image}
              caption={item.caption}
              sizes={{ desktop: item.width === "wide" ? "42.5vw" : "27.8vw", mobile: "288px" }}
              imageClassName={
                item.width === "wide"
                  ? "aspect-square ui-desktop:aspect-[612/400] ui-desktop:w-[calc((100cqw-2*var(--grid-margin))*612/1248)]"
                  : "aspect-square ui-desktop:w-[calc((100cqw-2*var(--grid-margin))*400/1248)]"
              }
            />
          ),
        }))}
      />
    </section>
  );
}

/** The closing Button Cards (Figma 3565:98704 / 3587:127512): two on desktop, stacked on mobile. */
export function ButtonCards() {
  return (
    <section aria-label="More from Sky Jewelry" className={`site-container grid gap-space-6 ui-desktop:grid-cols-2 ${SECTION_Y}`}>
      {content.buttonCards.map((card) => (
        <ButtonCard
          key={card._key}
          title={card.title}
          body={card.body}
          cta={card.cta}
          image={card.image}
          headingLevel={2}
          sizes={{ desktop: "42.5vw", mobile: "calc(100vw - 2.5rem)" }}
          className="aspect-[350/438] ui-desktop:aspect-[612/500]"
        />
      ))}
    </section>
  );
}
