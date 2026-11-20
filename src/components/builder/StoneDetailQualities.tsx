import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "@/components/home/styles";
import { Carousel } from "@/components/ui/Carousel";
import { QualityCard } from "@/components/ui/QualityCard";
import { RichText, plainText } from "@/components/ui/RichText";
import { DIAMOND_SCALES, gradeLabel } from "@/content/builder";
import { CLARITY_GRADES, COLOR_GRADES, CUT_GRADES } from "@/content/builder-grades";
import { gradeScales, productDetailContent } from "@/content/product-detail";
import type { Stone } from "@/lib/builder";

/**
 * "Your Diamond's Qualities" on the stone page (desktop 3565:100886, mobile 3587:126056): the Product Detail
 * section's cards with this stone's own grades. The copy for each grade is in builder-grades.ts.
 * Clarity: the desktop frame's scale runs SI1 to FL (the builder's own scale); the mobile frame's starts at SI2,
 * as the Product Detail mobile frame. Each breakpoint shows its frame's scale.
 */
export function StoneDetailQualities({ stone }: { stone: Pick<Stone, "color" | "clarity" | "cut"> }) {
  const heading = productDetailContent.qualitiesHeading;
  const cutLabel = gradeLabel(DIAMOND_SCALES.cut, stone.cut);
  const clarity = (options: string[]) => (
    <QualityCard
      title={gradeScales.clarity.title}
      grade={stone.clarity}
      options={options}
      illustration={gradeScales.clarity.illustration}
      description={CLARITY_GRADES[stone.clarity]?.description ?? ""}
    />
  );
  const cards = [
    {
      key: "color",
      node: (
        <QualityCard
          title={gradeScales.color.title}
          grade={stone.color}
          options={DIAMOND_SCALES.color.map((grade) => grade.label)}
          illustration={gradeScales.color.illustration}
          description={COLOR_GRADES[stone.color]?.description ?? ""}
        />
      ),
    },
    {
      key: "clarity",
      node: (
        <>
          <div className="hidden h-full ui-desktop:block">{clarity(DIAMOND_SCALES.clarity.map((grade) => grade.label))}</div>
          <div className="h-full ui-desktop:hidden">{clarity(gradeScales.clarity.options)}</div>
        </>
      ),
    },
    {
      key: "cut",
      node: (
        <QualityCard
          title={gradeScales.cut.title}
          grade={cutLabel}
          options={DIAMOND_SCALES.cut.map((grade) => grade.label)}
          illustration={gradeScales.cut.illustration}
          description={CUT_GRADES[stone.cut]?.description ?? ""}
        />
      ),
    },
  ];
  return (
    <section aria-labelledby="stone-qualities" className={`flex flex-col gap-space-6 bg-secondary-skin ui-desktop:gap-space-11 ${SECTION_Y}`}>
      <h2 id="stone-qualities" className={`site-container text-center ${SECTION_HEADING}`}>
        <RichText value={heading} emClassName={SECTION_HEADING_EM} />
      </h2>
      <Carousel label={plainText(heading)} desktop="grid" gridClassName="ui-desktop:grid-cols-3" itemClassName="w-[18rem] ui-desktop:w-auto" items={cards} />
    </section>
  );
}
