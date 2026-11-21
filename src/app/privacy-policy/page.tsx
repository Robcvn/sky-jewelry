import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { withBasePath } from "@/components/ui/shared";
import { privacyPolicy as doc } from "@/content/legal";

export const metadata: Metadata = { title: doc.title, description: doc.seo.description, alternates: { canonical: withBasePath("/privacy-policy/") } };

/** Built from Figma's Legal Template (3565:102087, mobile 3587:130116), with sample text true of this demonstration. */
export default function Page() {
  return <LegalPage doc={doc} />;
}
