import type { Metadata } from "next";
import { BuilderSteps } from "@/components/builder/BuilderSteps";
import { SETTINGS_PATH } from "@/components/builder/ring";
import { SettingListing } from "@/components/builder/SettingListing";
import { withBasePath } from "@/components/ui/shared";
import { builderContent, STONE_SHAPES } from "@/content/builder";
import { getBuilderCatalog, stoneSummary } from "@/lib/builder";

export const metadata: Metadata = {
  title: builderContent.settings.seo.title,
  description: builderContent.settings.seo.description,
  alternates: { canonical: withBasePath(SETTINGS_PATH) },
};

/**
 * Ring builder Step 1: choose a setting ("Start with a Setting" lands here). Stone first (?first=stone&stone=) it is
 * Step 2, limited to the settings that take the chosen stone's shape: the stones go along, slim, to find that one.
 */
export default async function DesignYourOwnPage() {
  const { settings, stones } = await getBuilderCatalog();
  // "with stone": the lowest stone price for each shape, and overall.
  const lowest = (shape?: string) => Math.min(...stones.filter((stone) => stone.available && (!shape || stone.shape === shape)).map((stone) => stone.price));
  const stoneFrom: Record<string, number> = { any: lowest() };
  for (const { value } of STONE_SHAPES) stoneFrom[value] = lowest(value);
  for (const key of Object.keys(stoneFrom)) if (!Number.isFinite(stoneFrom[key])) delete stoneFrom[key];
  const summaries = stones.map(stoneSummary);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <BuilderSteps current={1} stones={summaries} />
      {/* Step 1 lists the settings tagged "setting"; the store's four engagement rings keep their pages only. */}
      <SettingListing settings={settings.filter((setting) => setting.listed)} stoneFrom={stoneFrom} stones={summaries} />
    </main>
  );
}
