"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import type { Faqs as FaqsContent } from "@/content/home";
import { SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/**
 * Figma Home section 13: FAQs. Figma shows the second question open on desktop and all closed on mobile,
 * so that question starts open from 1024px until someone toggles it.
 */
export function Faqs({ content }: { content: FaqsContent }) {
  const isDesktop = useIsDesktop();
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const headingId = `${content._key}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={`site-container flex flex-col gap-space-10 text-primary-leather ui-desktop:flex-row ui-desktop:items-start ui-desktop:justify-between ${SECTION_Y}`}
    >
      <div className="flex flex-col items-center gap-space-6 text-center ui-desktop:w-[40.5%] ui-desktop:items-start ui-desktop:py-space-10 ui-desktop:pr-space-10 ui-desktop:text-left">
        <div className="flex flex-col gap-space-4">
          <h2 id={headingId} className={SECTION_HEADING}>
            <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className="type-body-sm-regular ui-desktop:type-body-md-regular">{content.body}</p>
        </div>
        <div className="ui-desktop:pt-space-2">
          <ButtonLink href={content.cta.href} variant="secondary" size="responsive">
            {content.cta.label}
          </ButtonLink>
        </div>
      </div>
      <Accordion className="w-full ui-desktop:w-[48.9%]">
        {content.items.map((item, index) => (
          <AccordionItem
            key={item._key}
            question={item.question}
            open={toggled[item._key] ?? (isDesktop && index === content.openOnDesktop)}
            onOpenChange={(open) => setToggled((current) => ({ ...current, [item._key]: open }))}
          >
            {item.answer.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
