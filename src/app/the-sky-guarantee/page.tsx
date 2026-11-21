import type { Metadata } from "next";
import { SectionNav } from "@/components/content/ArticleBlocks";
import { TitleHero } from "@/components/content/ContentSections";
import { SectionJump, SupportFaqs } from "@/components/content/SupportParts";
import { EducationCenter } from "@/components/home/EducationCenter";
import { ButtonText } from "@/components/ui/Button";
import { IconCard } from "@/components/ui/IconBlock";
import { Input, TextArea } from "@/components/ui/Input";
import { withBasePath } from "@/components/ui/shared";
import type { SupportCard } from "@/content/support";
import { getEditorialContent, homeSectionOf } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { supportPage: page } = await getEditorialContent();
  return { title: page.seo.title, description: page.seo.description, alternates: { canonical: withBasePath("/the-sky-guarantee/") } };
}

const H2 = "type-heading-lg scroll-mt-space-6 ui-desktop:type-heading-2xl";
const INTRO = "type-p-md-regular mt-space-4 ui-desktop:mt-space-6";

function Cards({ cards }: { cards: SupportCard[] }) {
  return (
    // Figma: three 264px cards across the 824 column on desktop, two 167px cards on mobile, 16px apart.
    <ul className="mt-space-8 grid grid-cols-2 gap-space-4 ui-desktop:mt-space-10 ui-desktop:grid-cols-3">
      {cards.map((card) => (
        <li key={card._key}>
          <IconCard icon={card.icon} title={card.title} body={card.body} action={card.action} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The support and guarantee page (Figma "Sky Guarantee": desktop 3565:101916, mobile 3587:129907). The header's
 * Support, the footer's The Sky Guarantee and its FAQs (at #faqs) all open it: one drawn page for three links (an
 * inference, Deviations). Desktop: the hero, the section list beside Support Offerings, Additional Services and Sky
 * FAQs, then the Education block. Mobile: the hero, a section menu, Contact Sky Jewelry (hidden on desktop), the same
 * sections and the Education block.
 */
export default async function SupportPage() {
  const { supportPage: page, homePage } = await getEditorialContent();
  const contact = page.contact;
  const navSections = [
    { id: "support-offerings", label: page.offerings.nav, nav: page.offerings.nav },
    { id: "additional-services", label: page.services.nav, nav: page.services.nav },
    { id: "faqs", label: page.faqs.nav, nav: page.faqs.nav },
  ];
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <TitleHero title={page.hero.title} body={page.hero.body} image={page.hero.image} />
      <SectionJump label={page.navLabel} sections={[{ id: "contact", label: contact.nav }, ...navSections.map(({ id, label }) => ({ id, label }))]} />
      <div className="site-container pt-space-11 pb-space-11 text-primary-leather ui-desktop:grid ui-desktop:grid-cols-[291fr_824fr] ui-desktop:gap-x-[10.66%] ui-desktop:pt-space-15 ui-desktop:pb-space-15">
        <div>
          <SectionNav label={page.navLabel} sections={navSections} floating={false} />
        </div>
        <div className="flex min-w-0 flex-col gap-space-13 ui-desktop:gap-space-15">
          {/* Mobile only: the desktop frame has this section hidden. */}
          <section aria-labelledby="contact" className="ui-desktop:hidden">
            <h2 id="contact" className={H2}>
              {contact.heading}
            </h2>
            <h3 className="type-heading-md mt-space-6">{contact.locationsHeading}</h3>
            <p className="type-body-md-regular mt-space-10">{contact.address}</p>
            <p className="type-overline-xs-medium mt-space-4">{contact.hoursLabel}</p>
            <p className="type-body-sm-regular mt-space-2">
              {contact.hours.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <ul className="mt-space-6 grid grid-cols-2 gap-space-4">
              {contact.cards.map((card) => (
                <li key={card._key}>
                  <IconCard icon={card.icon} title={card.title} body={card.body} action={card.action} />
                </li>
              ))}
            </ul>
            {/* "Send us a Message": drawn, with nothing to send it to. The fields work; Send Message is inert (Held for review). */}
            <h3 className="type-heading-md mt-space-8">{contact.formHeading}</h3>
            <div className="mt-space-4 flex flex-col gap-space-4">
              {contact.fields.map((field) => (
                <Input key={field._key} label={field.label} type={field.type} autoComplete={field.autoComplete} name={field._key} />
              ))}
              <TextArea label={contact.messageLabel} name="message" rows={6} className="[&>div]:min-h-[10.5rem]" />
            </div>
            <div className="mt-space-6">
              <ButtonText size="sm">{contact.submit}</ButtonText>
            </div>
          </section>

          <section aria-labelledby="support-offerings">
            <h2 id="support-offerings" className={H2}>
              {page.offerings.heading}
            </h2>
            <p className={INTRO}>{page.offerings.body}</p>
            <Cards cards={page.offerings.cards} />
          </section>

          <section aria-labelledby="additional-services">
            <h2 id="additional-services" className={H2}>
              {page.services.heading}
            </h2>
            <p className={INTRO}>{page.services.body}</p>
            <Cards cards={page.services.cards} />
          </section>

          <section aria-labelledby="faqs">
            <h2 id="faqs" className={H2}>
              {page.faqs.heading}
            </h2>
            <p className={INTRO}>{page.faqs.body}</p>
            <div className="mt-space-8 ui-desktop:mt-space-10">
              <SupportFaqs items={page.faqs.items} openOnDesktop={page.faqs.openOnDesktop} />
            </div>
          </section>
        </div>
      </div>
      <EducationCenter variant="support" content={homeSectionOf(homePage, "educationCenter", "education")} />
    </main>
  );
}
