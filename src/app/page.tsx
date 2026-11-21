import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { getEditorialContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { homePage } = await getEditorialContent();
  return {
    title: { absolute: homePage.seo.title },
    description: homePage.seo.description,
  };
}

export default async function Home() {
  const { homePage } = await getEditorialContent();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <HomeSections sections={homePage.sections} />
    </main>
  );
}
