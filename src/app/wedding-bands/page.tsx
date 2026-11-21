import type { Metadata } from "next";
import { PageSections } from "@/components/sections/PageSections";
import { getEditorialContent } from "@/lib/content";

const getPage = async () => (await getEditorialContent()).landing["wedding-bands"];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  return { title: page.seo.title, description: page.seo.description };
}

/** Category landing page, assembled from its content (Sanity, or src/content/landing/wedding-bands.ts; see src/lib/content.ts). */
export default async function LandingPage() {
  const page = await getPage();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageSections sections={page.sections} />
    </main>
  );
}
