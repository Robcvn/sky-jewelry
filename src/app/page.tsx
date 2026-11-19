import type { Metadata } from "next";
import { HomeSections } from "@/components/home/HomeSections";
import { homePage } from "@/content/home";

export const metadata: Metadata = {
  title: { absolute: homePage.seo.title },
  description: homePage.seo.description,
};

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <HomeSections sections={homePage.sections} />
    </main>
  );
}
