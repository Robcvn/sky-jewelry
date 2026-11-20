"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { cx } from "@/components/ui/shared";
import { useIsDesktop } from "@/components/ui/useIsDesktop";
import type { Faqs as FaqsContent } from "@/content/home";
import { LANDING_BUTTON, SECTION_HEADING, SECTION_HEADING_EM, SECTION_Y } from "./styles";

/**
 * Figma Home section 13: FAQs. Figma shows the second question open on desktop and all closed on mobile,
 * so that question starts open from 1024px until someone toggles it.
 * Mobile spacing (heading, intro, button, questions): 16 / 32 / 40px on Home, 12 / 20 / 24px on the landing pages;
 * desktop is 16 / 32 / 40 on both.
 */
export function Faqs({ content }: { content: FaqsContent }) {
  const isDesktop = useIsDesktop();
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const headingId = `${content._key}-heading`;
  const landing = Boolean(content.landing);

  return (
    <section
      aria-labelledby={headingId}
      className={cx(
        "site-container flex flex-col text-primary-leather ui-desktop:flex-row ui-desktop:items-start ui-desktop:justify-between ui-desktop:gap-space-10",
        landing ? "gap-space-6" : "gap-space-10",
        SECTION_Y,
      )}
    >
      <div
        className={cx(
          "flex flex-col items-center text-center ui-desktop:w-[40.5%] ui-desktop:items-start ui-desktop:gap-space-8 ui-desktop:py-space-10 ui-desktop:pr-space-10 ui-desktop:text-left",
          landing ? "gap-space-5" : "gap-space-8",
        )}
      >
        <div className={cx("flex flex-col ui-desktop:gap-space-4", landing ? "gap-space-3" : "gap-space-4")}>
          <h2 id={headingId} className={SECTION_HEADING}>
            <RichText value={content.heading} emClassName={SECTION_HEADING_EM} />
          </h2>
          <p className="type-body-sm-regular ui-desktop:type-body-md-regular">{content.body}</p>
        </div>
        <div>
          <ButtonLink href={content.cta.href} variant="secondary" size="responsive" className={landing ? LANDING_BUTTON : undefined}>
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
