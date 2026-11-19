import type { HomeSection } from "@/content/home";
import { About } from "./About";
import { BlogRow } from "./BlogRow";
import { CategoryStrip } from "./CategoryStrip";
import { CustomerStories } from "./CustomerStories";
import { DesignYourOwn } from "./DesignYourOwn";
import { EducationCenter } from "./EducationCenter";
import { Faqs } from "./Faqs";
import { FeatureGrid } from "./FeatureGrid";
import { HeroModule } from "./HeroModule";
import { HomeHero } from "./HomeHero";
import { ProductCarousel } from "./ProductCarousel";
import { Reviews } from "./Reviews";

/** Renders the Home sections in content order, by _type, as Sanity will deliver them. */
export function HomeSections({ sections }: { sections: HomeSection[] }) {
  return sections.map((section) => {
    switch (section._type) {
      case "homeHero":
        return <HomeHero key={section._key} content={section} />;
      case "categoryStrip":
        return <CategoryStrip key={section._key} content={section} />;
      case "designYourOwn":
        return <DesignYourOwn key={section._key} content={section} />;
      case "featureGrid":
        return <FeatureGrid key={section._key} content={section} />;
      case "heroModule":
        return <HeroModule key={section._key} content={section} />;
      case "productCarousel":
        return <ProductCarousel key={section._key} content={section} />;
      case "customerStories":
        return <CustomerStories key={section._key} content={section} />;
      case "educationCenter":
        return <EducationCenter key={section._key} content={section} />;
      case "reviews":
        return <Reviews key={section._key} content={section} />;
      case "blogRow":
        return <BlogRow key={section._key} content={section} />;
      case "about":
        return <About key={section._key} content={section} />;
      case "faqs":
        return <Faqs key={section._key} content={section} />;
    }
  });
}
