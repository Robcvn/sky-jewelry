import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
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
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="type-ui-sm-medium sr-only z-50 rounded-4 bg-base-white px-space-4 py-space-3 text-primary-leather shadow-md focus:not-sr-only focus:fixed focus:top-space-2 focus:left-space-2"
        >
          Skip to main content
        </a>
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
