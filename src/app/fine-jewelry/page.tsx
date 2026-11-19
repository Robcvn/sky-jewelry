import type { Metadata } from "next";
import { PageSections } from "@/components/sections/PageSections";
import { fineJewelryPage as page } from "@/content/landing/fine-jewelry";

export const metadata: Metadata = { title: page.seo.title, description: page.seo.description };

/** Category landing page, assembled from its content file (src/content/landing/fine-jewelry.ts). */
export default function LandingPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageSections sections={page.sections} />
    </main>
  );
}
