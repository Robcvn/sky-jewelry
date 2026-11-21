/*
 * Copy for the earrings builder, from the Figma frames: desktop Custom Earrings - Setting 3565:98137, Setting Info
 * 3565:98709, Stones 3565:98188, Stones Info 3565:99083, Complete 3565:99574; mobile 3587:126808, 3587:127517,
 * 3587:126869, 3587:127889, 3587:128540. Shaped like a Sanity document so it can move into a schema later.
 * Everything the ring builder words the same way is read from builderContent (src/content/builder.ts).
 */
import { em, span, type RichSpan } from "@/components/ui/RichText";

export const EARRINGS_ROUTE = "/design-your-own/earrings/";
export const EARRINGS_STONES_ROUTE = "/design-your-own/earrings/stone/";
export const EARRINGS_COMPLETE_ROUTE = "/design-your-own/earrings/complete/";

export const earringsContent = {
  _type: "earringsBuilder" as const,
  /**
   * The step bar. Desktop: "Select Earrings", "Select Diamonds", "Complete Earrings" (3565:98140). Mobile Step 1
   * and Step 2 (3587:126808, 3587:126869): "Select Earrings", "Select Stones", "Complete Earrings". The mobile
   * Setting Info, Stones Info and Complete frames keep the ring builder's "Setting / Stone / Ring" (a corrected
   * design oversight: the earrings words are used on every page).
   */
  steps: {
    label: "Design your earrings",
    setting: { verb: "Select", noun: "Earrings" },
    stones: { verb: "Select", noun: "Diamonds", mobileNoun: "Stones" },
    complete: { verb: "Complete", noun: "Earrings" },
  },
  settings: {
    seo: { title: "Design Your Own Earrings: Choose a Setting", description: "Choose a stud earring setting, then pair it with a matched pair of natural or lab-grown diamonds." },
    overline: "Design your own Earrings",
    heading: [span("Select "), em("your"), span(" Perfect Piece")] as RichSpan[],
    customize: "Customize",
    empty: "No settings matching your selection. Try adjusting your filters.",
  },
  setting: {
    material: "Material",
    metal: "Metal",
    selectThese: "Select These Earrings",
    remove: "Remove",
    settingInfo: "Setting Info",
    /** Drop a Hint's subheading on the earrings pages (Figma: Latin filler). */
    hintIntro: "Let someone know about the earrings you’ve designed.",
  },
  stones: {
    seo: { title: "Design Your Own Earrings: Choose Your Diamonds", description: "Choose a matched pair of natural or lab-grown diamonds by shape and quality for your stud earrings." },
    completeEarrings: "Complete Earrings",
    empty: "No diamond pairs matching your selection. Try adjusting your filters.",
    /** The screen-reader heading of the results. */
    results: "Diamond pairs",
  },
  pair: {
    selectThese: "Select These Diamonds",
    remove: "Remove",
    /** "0.63ct Diamond Info" (3565:99147). */
    diamondInfo: (carat: string) => `${carat}ct Diamond Info`,
    /** Mobile "0.63ct Diamond Qualities" (3587:127889); desktop keeps "Your Diamond's Qualities" for the pair. */
    qualities: (carat: string) => [span(`${carat}ct Diamond Qualities`)] as RichSpan[],
    /** Mobile tabs under the gallery ("Tabs - Line", 3587:127889). */
    tabs: ["Diamond 1", "Diamond 2"],
    tabsLabel: "Diamonds of the pair",
    /** The Carat card's note (Figma: Latin filler; the ring builder's says "center stone"). */
    caratNote: "The weight of this diamond.",
    photo: "Photo",
    specs: "Specs",
    certificate: "Certificate",
    viewsLabel: (name: string) => `Views of ${name}`,
  },
  complete: {
    seo: { title: "Design Your Own Earrings: Complete Your Earrings", description: "Review your earrings and add them to your bag." },
    /** "Four Prong Custom Diamond Stud Earrings with IGI 1.61 Total Carat Round Diamonds" (3565:99581). */
    name: (setting: string, pair: string) => `${setting} with ${pair}`,
    settingInfo: "Setting Info",
    /**
     * The model photo's badge (3565:99574, "Badge" on the second tile). Figma: "Showing 1.61ct", which beside a pair
     * of another weight read as a contradiction; reworded as the ring builder's badge (a corrected design oversight).
     */
    shownWith: "Shown with 1.61 ct",
    addFailed: "these earrings",
  },
  /**
   * The ring builder's drawn "Stone Unavailable" state, worded for a pair (inferred: the earrings frames draw no
   * unavailable state).
   */
  unavailable: {
    row: "These diamonds are no longer available.",
    selectNew: "Select New Diamonds",
    button: "Select New Diamonds",
    modal: {
      heading: "The Diamonds You Selected Are No Longer Available",
      body: "They’ve been purchased or removed from inventory since you added them. The rest of your build is saved. Choose new diamonds to complete your build.",
      primary: "Select New Diamonds",
      secondary: "Keep Browsing",
    },
  },
  /** The bag's pair row: "Natural Round Diamonds". */
  pairRowName: (origin: "natural" | "lab-grown", shape: string) => `${origin === "natural" ? "Natural" : "Lab"} ${shape} Diamonds`,
};
