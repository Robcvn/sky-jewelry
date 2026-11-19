import type { Metadata } from "next";
import { ADOBE_FONTS_STYLESHEET, fontClassName, fontStyle } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sky Jewelry",
    template: "%s | Sky Jewelry",
  },
  description: "Sky Jewelry website, in development.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontClassName} h-full antialiased`}
      style={fontStyle}
    >
      <head>
        {/* Font files on use.typekit.net load with CORS, so this connection needs crossOrigin. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="stylesheet" href={ADOBE_FONTS_STYLESHEET} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
