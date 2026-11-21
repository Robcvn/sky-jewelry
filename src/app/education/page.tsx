import type { Metadata } from "next";
import { withBasePath } from "@/components/ui/shared";
import { ContentList, type ListItem } from "@/components/content/ContentList";
import { EducationHero } from "@/components/content/ContentSections";
import { EducationCenter } from "@/components/home/EducationCenter";
import { GuaranteeIconsSection } from "@/components/sections/LandingSections";
import { educationTopics, resourceHref, topicById, type EducationResource } from "@/content/education";
import { getEditorialContent, resourceBySlug } from "@/lib/content";
import { guaranteeIcons } from "@/content/landing/shared";

export async function generateMetadata(): Promise<Metadata> {
  const { educationCenterPage: page } = await getEditorialContent();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: withBasePath("/education/") } };
}

const listItems = (resources: EducationResource[]): ListItem[] => resources.map((resource) => ({
  id: resource._id,
  href: resourceHref(resource),
  title: resource.title,
  excerpt: resource.excerpt,
  topic: resource.topic,
  topicLabel: topicById(resource.topic)?.label ?? "",
  subtopic: resource.subtopic,
  date: resource.date,
  image: resource.image,
}));


/**
 * The Education Center (Figma 3565:101629, mobile 3587:129570; topic menu 6963:54748, subtopics 6963:55696 / 7074:91849):
 * the hero, the topic tiles and resource grid (topic, subtopic, sort and page in the URL), Featured Education and the
 * Sky Jewelry Guarantee.
 */
export default async function EducationCenterPage() {
  const content = await getEditorialContent();
  const page = content.educationCenterPage;
  const items = listItems(content.educationResources);
  const lead = resourceBySlug(content, page.featured.lead)!;
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <EducationHero title={page.title} body={page.body} image={page.hero.image} />
      <section aria-label="Resources" className="site-container pt-space-11 ui-desktop:pt-space-15">
        <ContentList kind="education" items={items} topics={educationTopics} pageSize={page.pageSize} labels={{ allTopics: page.allTopics, topicsLabel: page.topicsLabel, results: "Resources" }} />
      </section>
      <div className="pt-space-17 pb-space-11 ui-desktop:pt-space-19 ui-desktop:pb-space-15">
        <EducationCenter
          variant="page"
          content={{
            _type: "educationCenter",
            _key: "featured-education",
            heading: [{ _type: "span", text: page.featured.heading, italic: false }],
            body: page.featured.body,
            cta: { label: "", href: "/education/" },
            featured: { topic: topicById(lead.topic)?.label ?? "", title: lead.title, body: lead.excerpt, href: resourceHref(lead), ctaLabel: "Read More", image: page.featured.leadImage },
            resources: page.featured.items.map((item) => {
              const resource = resourceBySlug(content, item.slug)!;
              return { _key: resource._id, topic: topicById(resource.topic)?.label ?? "", title: resource.title, href: resourceHref(resource), image: item.image };
            }),
          }}
        />
      </div>
      <GuaranteeIconsSection content={guaranteeIcons("guarantee")} />
    </main>
  );
}
