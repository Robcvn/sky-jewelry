import type { CSSProperties } from "react";
import localFont from "next/font/local";

/*
 * All font definitions live here. Components use the theme's font-heading and
 * font-body, or the type-* utilities, and never name a font family directly.
 */

const bdMegalona = localFont({
  variable: "--font-bd-megalona",
  display: "swap",
  // Seven faces is too much to preload. The browser fetches only the faces a page uses.
  preload: false,
  fallback: ["Times New Roman", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
  src: [
    { path: "./bd-megalona/BDMegalona-Thin.woff2", weight: "100", style: "normal" },
    { path: "./bd-megalona/BDMegalona-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "./bd-megalona/BDMegalona-UltraLight.woff2", weight: "250", style: "normal" },
    { path: "./bd-megalona/BDMegalona-Light.woff2", weight: "300", style: "normal" },
    { path: "./bd-megalona/BDMegalona-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "./bd-megalona/BDMegalona-ExtraLightItalic.woff2", weight: "200", style: "italic" },
    { path: "./bd-megalona/BDMegalona-LightItalic.woff2", weight: "300", style: "italic" },
  ],
});

/*
 * IvyEpic comes from Adobe Fonts. The root layout loads this kit, which provides
 * the "ivyepic" family in weights 400 and 500, normal style only.
 */
export const ADOBE_FONTS_STYLESHEET = "https://use.typekit.net/xcs1hir.css";

export const IVY_EPIC_FALLBACK_STACK =
  '"Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", Arial, sans-serif';

export const fontClassName = bdMegalona.variable;

export const fontStyle = {
  "--font-ivy-epic": `"ivyepic", ${IVY_EPIC_FALLBACK_STACK}`,
} as CSSProperties;
