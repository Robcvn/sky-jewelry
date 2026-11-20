/*
 * What each diamond grade means: the line under the slider in the Cut / Color / Clarity modal, the paragraph on the
 * "Your Diamond's Qualities" cards and the short note on the stone page's info cards.
 * Figma writes one grade of each scale (Color G, Clarity VVS2, Cut Excellent); those are kept word for word. The
 * rest are replacement copy that states the grade's standard definition and nothing more.
 */
export type GradeCopy = { short: string; description: string };

export const COLOR_GRADES: Record<string, GradeCopy> = {
  D: { short: "Colorless", description: "Colorless: the highest color grade, with no detectable tint." },
  E: { short: "Colorless", description: "Colorless: only minute traces of color, which a gemologist can detect." },
  F: { short: "Colorless", description: "Colorless: a slight trace of color that only a gemologist can detect." },
  G: {
    short: "Nearly colorless",
    description:
      "These diamonds are considered nearly colorless, with any slight tint being difficult to detect. They offer excellent value, making them a smart choice for those seeking larger stones at more affordable prices.",
  },
  H: { short: "Nearly colorless", description: "Nearly colorless: a faint tint that is hard to see unless the diamond is compared with a higher grade." },
  I: { short: "Nearly colorless", description: "Nearly colorless: a slight tint that is difficult to detect once the diamond is set." },
  J: { short: "Nearly colorless", description: "Nearly colorless: a faint warm tint that can show in larger stones." },
};

export const CLARITY_GRADES: Record<string, GradeCopy> = {
  FL: { short: "Flawless", description: "Flawless: no inclusions or blemishes are visible under 10x magnification." },
  IF: { short: "Internally flawless", description: "Internally Flawless: no inclusions, and only minor surface blemishes, are visible under 10x magnification." },
  VVS1: { short: "Inclusions are extremely difficult to see", description: "Very, Very Slightly Included: Inclusions are extremely difficult to see, even under 10x magnification." },
  VVS2: {
    short: "Inclusions are extremely difficult to see",
    description: "Very, Very Slightly Included: Inclusions exist but are extremely difficult to detect, even under 10x magnification.",
  },
  VS1: { short: "Minor inclusions, difficult to see", description: "Very Slightly Included: Minor inclusions that are difficult to see under 10x magnification." },
  VS2: { short: "Minor inclusions, somewhat easy to see", description: "Very Slightly Included: Minor inclusions that are somewhat easy to see under 10x magnification." },
  SI1: { short: "Inclusions noticeable under magnification", description: "Slightly Included: Inclusions are noticeable under 10x magnification." },
};

/** Keyed by the cut slug (good, very-good, excellent). */
export const CUT_GRADES: Record<string, GradeCopy> = {
  excellent: { short: "Exceptional fire and brilliance", description: "Exceptional fire, brilliance, and precise diamond craftsmanship." },
  "very-good": { short: "Strong brilliance and fire", description: "Reflects most of the light that enters the diamond, with strong brilliance and fire." },
  good: { short: "Good brilliance", description: "Reflects a good share of the light that enters the diamond, with less brilliance than the higher grades." },
};
