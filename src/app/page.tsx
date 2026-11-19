import Link from "next/link";

export default function Home() {
  return (
    <main className="site-container flex flex-1 flex-col items-start justify-center gap-space-6 py-space-17">
      <h1>Sky Jewelry</h1>
      <p>The website is in development.</p>
      <Link href="/styleguide/" className="type-ui-sm-link inline-block py-space-1">
        View the style guide
      </Link>
    </main>
  );
}
