import type { Metadata } from "next";

/*
 * The 404 page (out/404.html, which GitHub Pages serves for any unknown address). It shows what Next.js's built-in page
 * showed, unchanged: a designed 404 page is still an open finding (QA sweep S1). It exists for its head (Task 29): the
 * built-in page added its own <title> beside the layout's, and Next.js always adds <meta name="robots" content="noindex">
 * to a 404 beside the layout's "noindex, nofollow". Here the page has one title, and robots: null leaves Next.js's
 * noindex as the only robots tag.
 */
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: null,
};

// Next.js's built-in 404 (next/dist/client/components/http-access-fallback/error-fallback.js), without its <title>.
const css =
  "body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <div
        style={{
          fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
          height: "100vh",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <h1
            className="next-error-h1"
            style={{ display: "inline-block", margin: "0 20px 0 0", padding: "0 23px 0 0", fontSize: 24, fontWeight: 500, verticalAlign: "top", lineHeight: "49px" }}
          >
            404
          </h1>
          <div style={{ display: "inline-block" }}>
            <h2 style={{ fontSize: 14, fontWeight: 400, lineHeight: "49px", margin: 0 }}>This page could not be found.</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
