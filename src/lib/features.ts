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
