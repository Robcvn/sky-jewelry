import { HomeSections } from "@/components/home/HomeSections";
import type { LandingSection, PageSection } from "@/content/landing/types";
import { BestSellersSection } from "./BestSellers";
import {
  ButtonCardPairSection,
  CtaCalloutSection,
  DiamondInspectionSection,
  FeatureCardRowSection,
  GuaranteeIconsSection,
  TileCarouselSection,
} from "./LandingSections";

/** Renders a landing page's sections in content order, by _type: the landing types here, Home types via HomeSections. */
export function PageSections({ sections }: { sections: PageSection[] }) {
  return sections.map((section) =>
    section.only ? (
      <div key={section._key} className={section.only === "desktop" ? "hidden ui-desktop:block" : "ui-desktop:hidden"}>
        <Section section={section} />
      </div>
    ) : (
      <Section key={section._key} section={section} />
    ),
  );
}

function Section({ section }: { section: LandingSection }) {
  switch (section._type) {
      case "ctaCallout":
        return <CtaCalloutSection key={section._key} content={section} />;
      case "tileCarousel":
        return <TileCarouselSection key={section._key} content={section} />;
      case "guaranteeIcons":
        return <GuaranteeIconsSection key={section._key} content={section} />;
      case "featureCardRow":
        return <FeatureCardRowSection key={section._key} content={section} />;
      case "bestSellers":
        return <BestSellersSection key={section._key} content={section} />;
      case "buttonCardPair":
        return <ButtonCardPairSection key={section._key} content={section} />;
      case "diamondInspection":
        return <DiamondInspectionSection key={section._key} content={section} />;
      default:
        return <HomeSections key={section._key} sections={[section]} />;
  }
}
