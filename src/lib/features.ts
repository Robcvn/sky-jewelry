/**
 * Feature switches. A plain module (not "use client"), so server and client components read the same value: a
 * value imported from a "use client" file into a server component is a client reference, which is always truthy.
 */

/**
 * The 360° switch, off until the 360 image sequences exist (the asset list is in notes/360-assets-needed.md).
 * Off: Figma's 360 marker (Hint360) renders nothing anywhere, Product Detail never shows the viewer or its
 * "360° View" tab, the style guide shows no viewer demo, and pagination dots keep their usual place. On (this one
 * line): the marker returns wherever the pages draw it, and Product Detail shows the viewer for products with a
 * sequence (Product.spin). The "360° View / Images / Video" tab rows of the builder frames are not built either way.
 */
export const SHOW_360 = false;

/**
 * Metal swatches: one per distinct photo (Task 26, on trial). On: a product's metals that share a main photo (14K and
 * 18K of a colour, white gold and platinum) share one swatch; a card opened without a Metal filter starts on the first
 * metal with a studio photo, and a lifestyle photo (LIFESTYLE_PHOTOS in swatches.ts) gets a swatch beside a studio
 * photo only when the Metal filter chose that metal. Off (this one line): one swatch per metal, opening on the first
 * variant, as before.
 */
export const GROUP_SWATCHES_BY_PHOTO = true;
