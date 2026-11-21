import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { withBasePath } from "@/components/ui/shared";
import { getEditorialContent } from "@/lib/content";

const getDoc = async () => (await getEditorialContent()).legal["privacy-policy"];

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getDoc();
  return { title: doc.title, description: doc.seo.description, alternates: { canonical: withBasePath("/privacy-policy/") } };
}

/** Built from Figma's Legal Template (3565:102087, mobile 3587:130116), with sample text true of this demonstration. */
export default async function Page() {
  return <LegalPage doc={await getDoc()} />;
}
