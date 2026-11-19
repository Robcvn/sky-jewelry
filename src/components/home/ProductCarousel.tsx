import { Carousel } from "@/components/ui/Carousel";
import { ProductCardSummary } from "@/components/ui/ProductCardSummary";
import { RichText, plainText } from "@/components/ui/RichText";
import type { ProductCarousel as ProductCarouselContent } from "@/content/home";
import { formatPrice, productById, productHref } from "@/content/products";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/** Desktop card width: four cards across the content width. */
const CARD_W = "(100cqw - 2 * var(--grid-margin) - 3 * var(--spacing-space-6)) / 4";

/** Figma Home section 6: best-selling engagement rings in a carousel of Product Card - Summary. */
export function ProductCarousel({ content }: { content: ProductCarouselContent }) {
  const headingId = `${content._key}-heading`;

  return (
    <section aria-labelledby={headingId} className={`flex flex-col gap-space-8 ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <div className="site-container flex flex-col items-center gap-space-3 text-center text-primary-leather ui-desktop:gap-space-4">
        <p className="type-overline-xs-medium ui-desktop:type-overline-sm-medium">{content.overline}</p>
        <h2 id={headingId} className={SECTION_HEADING}>
          <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
        </h2>
      </div>
      <Carousel
        label={plainText(content.heading)}
        itemClassName="w-[18.0625rem] ui-desktop:w-[calc((100cqw-2*var(--grid-margin)-3*var(--spacing-space-6))/4)]"
        arrowTop={`calc(${CARD_W} / 2)`}
        items={content.productIds.map((id, index) => {
          const product = productById(id);
          return {
            key: `${id}-${index}`,
            node: (
              <ProductCardSummary
                name={product.name}
                body={product.description}
                priceLabel={`starting at ${formatPrice(product.priceFrom)}`}
                href={productHref(product)}
                image={product.image}
                sizes={{ desktop: "calc(25vw - 66px)", mobile: "289px" }}
              />
            ),
          };
        })}
      />
    </section>
  );
}
