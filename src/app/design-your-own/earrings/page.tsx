import type { Metadata } from "next";
import { EarringSettingListing } from "@/components/earrings/EarringSettingListing";
import { EarringsSteps } from "@/components/earrings/EarringsSteps";
import { withBasePath } from "@/components/ui/shared";
import { EARRINGS_ROUTE, earringsContent } from "@/content/earrings";
import { getEarringsCatalog } from "@/lib/earrings";

export const metadata: Metadata = {
  title: earringsContent.settings.seo.title,
  description: earringsContent.settings.seo.description,
  alternates: { canonical: withBasePath(EARRINGS_ROUTE) },
};

/** Earrings builder Step 1: choose a setting (Figma Custom Earrings - Setting 3565:98137, mobile 3587:126808). */
export default async function DesignYourOwnEarringsPage() {
  const { settings } = await getEarringsCatalog();
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <EarringsSteps current={1} />
      <EarringSettingListing settings={settings.filter((setting) => setting.listed)} />
    </main>
  );
}
