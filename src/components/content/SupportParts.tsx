"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Dropdown } from "@/components/ui/Dropdown";
import { useIsDesktop } from "@/components/ui/useIsDesktop";

/**
 * "Sky FAQs" (Sky Guarantee 3565:101916 / 3587:129907): Figma's Accordion Items, the second open on desktop and all
 * closed on mobile, as Home's FAQ block does it.
 */
export function SupportFaqs({ items, openOnDesktop }: { items: Array<{ _key: string; question: string; answer: string }>; openOnDesktop: number }) {
  const isDesktop = useIsDesktop();
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionItem
          key={item._key}
          question={item.question}
          open={toggled[item._key] ?? (isDesktop && index === openOnDesktop)}
          onOpenChange={(open) => setToggled((current) => ({ ...current, [item._key]: open }))}
        >
          <p>{item.answer}</p>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/**
 * The mobile section menu under the support hero (3587:129907): a full-width Dropdown (MD) whose options jump to the
 * page's sections; it shows the section last chosen (the first, as drawn, to begin with).
 */
export function SectionJump({ label, sections }: { label: string; sections: Array<{ id: string; label: string }> }) {
  const [value, setValue] = useState(sections[0]?.id ?? "");
  return (
    // Figma: no line above the menu, a leather line under it, then the next section's own black-alpha-20 rule.
    <div className="relative pb-px after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-black-alpha-20 ui-desktop:hidden">
      <Dropdown
        label={label}
        options={sections.map((section) => ({ value: section.id, label: section.label }))}
        value={value}
        onChange={(id) => {
          setValue(id);
          const target = document.getElementById(id);
          if (!target) return;
          window.history.replaceState(window.history.state, "", `#${id}`);
          target.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }}
        className="[&>div:first-of-type]:rounded-none [&>div:first-of-type]:border-x-0 [&>div:first-of-type]:border-t-transparent [&>div:first-of-type]:border-b-primary-leather"
      />
    </div>
  );
}
