"use client";

import { CategoryCard } from "@/components/ui/CategoryCard";
import { Scrollbar, useScrollProgress } from "@/components/ui/Scrollbar";
import type { CategoryStrip as CategoryStripContent } from "@/content/home";
import { useDragScroll } from "@/components/ui/useDragScroll";

/** Figma Home "Frame 230" / "stack": five Category Cards. A row of squares on desktop, a swipeable row on mobile. */
export function CategoryStrip({ content }: { content: CategoryStripContent }) {
  const { ref, progress, scrollable } = useScrollProgress<HTMLDivElement>();
  const dragRef = useDragScroll(ref);

  return (
    <nav aria-label={content.label} className="flex flex-col gap-space-6 pb-space-10 ui-desktop:pb-0">
      <div
        ref={dragRef}
        role="region"
        aria-label={`${content.label}, scroll for more`}
        tabIndex={scrollable ? 0 : undefined}
        data-scroll-region
        className="snap-x snap-mandatory overflow-x-auto border-y border-primary-leather [scrollbar-width:none] focus-visible:-outline-offset-2 ui-desktop:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex">
          {content.categories.map((category) => (
            <li
              key={category._key}
              className="w-[16.25rem] shrink-0 snap-start border-r border-primary-leather last:border-r-0 ui-desktop:w-auto ui-desktop:flex-1"
            >
              <CategoryCard label={category.label} href={category.href} image={category.image} sizes={{ desktop: "20vw", mobile: "260px" }} />
            </li>
          ))}
        </ul>
      </div>
      <div className="px-(--grid-margin) ui-desktop:hidden">
        <Scrollbar progress={progress} />
      </div>
    </nav>
  );
}
