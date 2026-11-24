"use client";

import { StoneListing } from "@/components/builder/StoneListing";
import { earringsContent } from "@/content/earrings";
import type { Product } from "@/content/products";
import type { StonePair } from "@/lib/earrings";
import { asPair, PairCard, PairQuickView } from "./PairCard";
import { earringsCompleteHref, pairHref } from "./routes";

const text = earringsContent;

/**
 * Earrings builder Step 2, choose a matched pair (Figma desktop Custom Earrings - Stones 3565:98188, mobile
 * 3587:126869; mobile sheets Filters / Stones - Earrings 3587:129317 and its Expanded 3587:129411, node for node the
 * ring builder's Filters / Stone sheets). The ring builder's Step 2 listing runs it: the Natural / Lab-Grown tabs,
 * the shape tiles, the Cut / Color / Clarity / Carat / Price / Certificate filters, Advanced Filters, the mobile
 * sheet and chips, sorting and View More, all in the URL. Pairs are filtered as one: carat is the pair's total
 * weight and price the pair's, Table, Depth and L/W Ratio the two stones' average. The heading is the desktop
 * frame's "Select your stone shape and Quality" at both widths: the mobile frame repeats Step 1's "Design your own
 * Earrings / Select your Perfect Piece" (a corrected design oversight). The cards (two per row on desktop, one on
 * mobile), the page size (the desktop frame draws 14 cards, the mobile frame 12) and the quick view are the earrings
 * frames', and so is Advanced Filters drawn open on desktop (the ring's frame draws it closed).
 */
export function PairListing({ pairs, settings }: { pairs: StonePair[]; settings: Product[] }) {
  return (
    <StoneListing
      stones={pairs}
      settings={settings}
      variant={{
        pageSize: { desktop: 14, mobile: 12 },
        advancedOpen: true,
        // Figma's earrings Stones frame (3565:98188): Symmetry, Fluorescence, Table, Depth, L/W Ratio, then Polish.
        advancedOrder: ["symmetry", "fluor", "table", "depth", "ratio", "polish"],
        containerClassName: "py-space-11",
        advancedClassName: "gap-space-4",
        resultsClassName: "ui-desktop:-mt-space-4",
        gridClassName: "grid grid-cols-1 gap-space-4 ui-desktop:grid-cols-2",
        resultsLabel: text.stones.results,
        emptyText: text.stones.empty,
        card: (stone, { ring, settingPrice, onQuickView }) => (
          <PairCard
            pair={asPair(stone)}
            href={pairHref(stone.handle, ring)}
            completeHref={earringsCompleteHref({ ...ring, stone: stone.handle })}
            settingPrice={settingPrice}
            onQuickView={onQuickView}
          />
        ),
        quickView: (stone, { ring, settingPrice, open, onClose }) => (
          <PairQuickView
            key={stone.handle}
            pair={asPair(stone)}
            open={open}
            onClose={onClose}
            href={pairHref(stone.handle, ring)}
            completeHref={earringsCompleteHref({ ...ring, stone: stone.handle })}
            settingPrice={settingPrice}
          />
        ),
      }}
    />
  );
}
