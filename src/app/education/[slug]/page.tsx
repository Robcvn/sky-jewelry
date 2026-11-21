import type { Metadata } from "next";
import { withBasePath } from "@/components/ui/shared";
import { notFound } from "next/navigation";
import { SectionNav } from "@/components/content/ArticleBlocks";
import { ArticleBody } from "@/components/content/ArticleBody";
import { NextResource, ResourceHero } from "@/components/content/ContentSections";
import { BestSellersSection } from "@/components/sections/BestSellers";
import { articleSections } from "@/content/article";
import { contentBestSellers, educationCenterPage as page, educationResources, resourceBySlug, resourceHref, topicById } from "@/content/education";

export const dynamicParams = false;

export function generateStaticParams() {
  return educationResources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resource = resourceBySlug((await params).slug);
  if (!resource) return {};
  return { title: resource.title, description: resource.excerpt, alternates: { canonical: withBasePath(resourceHref(resource)) } };
}

/**
 * Resource Detail (Figma 3565:101773, mobile 3587:129748, mobile section menu 4142:57639 / 4142:72011): the hero, the
 * section list beside the article (a floating menu on mobile), "Next Resource" and the best sellers.
 */
export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const resource = resourceBySlug((await params).slug);
  if (!resource) notFound();
  const topic = topicById(resource.topic);
  const next = resourceBySlug(resource.next);
  const sections = articleSections(resource.body);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <article>
        <ResourceHero
          title={resource.title}
          body={resource.subtitle}
          topic={{ label: topic?.label ?? "", href: `/education/?topic=${resource.topic}` }}
          image={page.detail.hero}
          back={{ label: page.detail.back, href: "/education/" }}
        />
        <div className="site-container pt-space-11 pb-space-11 ui-desktop:grid ui-desktop:grid-cols-[291fr_824fr] ui-desktop:gap-x-[10.66%] ui-desktop:pt-space-15 ui-desktop:pb-space-15">
          {/* Desktop: the sticky section list in the left column. Mobile: the same component's floating menu (fixed, so it takes no room). */}
          <div>{sections.length ? <SectionNav label={resource.navLabel} sections={sections} /> : null}</div>
          <div className="flex min-w-0 flex-col">
            <ArticleBody body={resource.body} kind="resource" />
            {next ? (
              <div className="mt-space-14 ui-desktop:mt-space-17">
                <NextResource label={page.detail.next} title={next.title} body={next.excerpt} href={resourceHref(next)} image={page.detail.nextImage} cta={page.detail.readNow} />
              </div>
            ) : null}
          </div>
        </div>
      </article>
      <BestSellersSection content={contentBestSellers} />
    </main>
  );
}
