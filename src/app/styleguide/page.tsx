import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GridOverlay } from "@/components/styleguide/GridOverlay";
import {
  blurTokens,
  colorGroups,
  radiusTokens,
  semanticTypeStyles,
  shadowTokens,
  spacingTokens,
  textShadowTokens,
  typeStyles,
  type TypeStyle,
} from "@/design-system/tokens";
import { IVY_EPIC_FALLBACK_STACK } from "@/fonts";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  ["fonts", "Fonts"],
  ["colors", "Colors"],
  ["type", "Type styles"],
  ["responsive", "Responsive type"],
  ["grid", "Grid"],
  ["effects", "Effects"],
  ["spacing", "Spacing and radius"],
] as const;

const TYPE_GROUPS = [
  ["heading-default", "Heading", "Crafted to last"],
  ["heading-caps", "Heading caps", "Crafted to last"],
  ["heading-italic", "Heading italic", "Crafted to last"],
  ["misc", "Price", "$12,500"],
  ["ui", "UI", "Add to bag"],
  ["body", "Body", "Each stone is selected by hand and set in our studio."],
  ["p", "Paragraph", "Each stone is selected by hand and set in our studio."],
  ["overline", "Overline", "New arrivals"],
] as const;

const MEGALONA_FACES = [
  ["Thin", 100, "normal"],
  ["Extra Light", 200, "normal"],
  ["Ultra Light", 250, "normal"],
  ["Light", 300, "normal"],
  ["Thin Italic", 100, "italic"],
  ["Extra Light Italic", 200, "italic"],
  ["Light Italic", 300, "italic"],
] as const;

const GRID_SPECS = [
  ["Desktop, 1024px and up", "12 columns", "24px gutter", "96px margin at 1440px", "1920px maximum width"],
  ["Mobile, below 1024px", "6 columns", "16px gutter", "20px margin at 390px", "Margin scales with the viewport"],
] as const;

const CHECKERBOARD: CSSProperties = {
  background:
    "repeating-conic-gradient(var(--color-black-alpha-10) 0 25%, transparent 0 50%) 0 0 / 16px 16px",
};

const typeStyleByFigmaName = new Map(typeStyles.map((style) => [style.figmaName, style]));

function lineHeightLabel(style: TypeStyle) {
  return style.lineHeight.replace("px", "");
}

function describeStyle(style: TypeStyle) {
  return [
    `${style.figmaFont} ${style.figmaStyle}`,
    `weight ${style.weight}`,
    `${style.size}px / ${lineHeightLabel(style)}`,
    `tracking ${style.letterSpacing}%`,
    style.uppercase ? "uppercase" : "original case",
    style.underline ? "underlined" : null,
    style.features ? `features ${style.features}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function describeFigmaStyle(figmaName: string) {
  const style = typeStyleByFigmaName.get(figmaName);
  if (!style) return figmaName;
  return `${figmaName}, ${style.size}px / ${lineHeightLabel(style)}, weight ${style.weight}, tracking ${style.letterSpacing}%`;
}

function alphaPercent(hex: string) {
  if (hex.length !== 9) return null;
  return `${Math.round((parseInt(hex.slice(7), 16) / 255) * 100)}% opacity`;
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-space-6 border-t border-base-black pt-space-8">
      <h2 id={`${id}-title`} className="type-heading-caps-lg">
        {title}
      </h2>
      {intro ? <p className="type-body-sm-regular mt-space-3 max-w-[40rem] text-black-alpha-70">{intro}</p> : null}
      <div className="mt-space-10">{children}</div>
    </section>
  );
}

function GroupTitle({ children }: { children: ReactNode }) {
  return <h3 className="type-overline-sm-medium mb-space-5">{children}</h3>;
}

function SpecRow({ specimen, children }: { specimen: ReactNode; children: ReactNode }) {
  return (
    <div className="site-grid items-start gap-y-space-3 border-t border-black-alpha-10 py-space-6">
      <div className="col-span-6 min-w-0 break-words desktop:col-span-7">{specimen}</div>
      <div className="col-span-6 min-w-0 desktop:col-span-5">{children}</div>
    </div>
  );
}

function Tile({ label, detail, children }: { label: string; detail: string; children: ReactNode }) {
  return (
    <figure className="col-span-3 min-w-0 desktop:col-span-3">
      {children}
      <figcaption className="mt-space-3">
        <span className="type-ui-xs-medium block break-words">{label}</span>
        <span className="type-ui-2xs-regular mt-space-1 block break-words text-black-alpha-70">{detail}</span>
      </figcaption>
    </figure>
  );
}

export default function StyleGuidePage() {
  return (
    <>
      <main className="site-container flex flex-col gap-space-17 py-space-13">
        <header>
          <p className="type-overline-sm-medium">Sky Jewelry design system v1.0</p>
          <h1 className="mt-space-3">Style guide</h1>
          <nav aria-label="Style guide sections" className="mt-space-6">
            <ul className="flex flex-wrap gap-x-space-5 gap-y-space-1">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="type-ui-sm-link inline-block py-space-1">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/styleguide/components/" className="type-ui-sm-link inline-block py-space-1">
                  Components
                </Link>
              </li>
              <li>
                <Link href="/" className="type-ui-sm-link inline-block py-space-1">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <Section id="fonts" title="Fonts">
          <GroupTitle>BD Megalona, headings</GroupTitle>
          {MEGALONA_FACES.map(([name, weight, style]) => (
            <SpecRow
              key={name}
              specimen={
                <span className="type-heading-lg" style={{ fontWeight: weight, fontStyle: style }}>
                  Sky Jewelry
                </span>
              }
            >
              <p className="type-ui-xs-medium">{name}</p>
              <p className="type-ui-2xs-regular mt-space-1 text-black-alpha-70">
                Weight {weight}, {style}
              </p>
            </SpecRow>
          ))}
          <div className="mt-space-10">
            <GroupTitle>IvyEpic, body and UI</GroupTitle>
            <SpecRow specimen={<span className="type-ui-xl-regular">Each stone is selected by hand.</span>}>
              <p className="type-ui-xs-medium">Regular</p>
              <p className="type-ui-2xs-regular mt-space-1 text-black-alpha-70">Weight 400, normal, Adobe Fonts</p>
            </SpecRow>
            <SpecRow specimen={<span className="type-ui-xl-medium">Each stone is selected by hand.</span>}>
              <p className="type-ui-xs-medium">Medium</p>
              <p className="type-ui-2xs-regular mt-space-1 text-black-alpha-70">Weight 500, normal, Adobe Fonts</p>
              <p className="type-ui-2xs-regular mt-space-1 break-words text-black-alpha-70">
                Fallback: {IVY_EPIC_FALLBACK_STACK}
              </p>
            </SpecRow>
          </div>
        </Section>

        <Section
          id="colors"
          title="Colors"
          intro="Every color variable in the Figma file. Swatches marked “variable only” exist as variables but are not shown on the Figma Colors page. The two input label grays are hard-coded in the Figma Input component."
        >
          <div className="flex flex-col gap-space-10">
            {colorGroups.map((group) => (
              <div key={group.label}>
                <GroupTitle>{group.label}</GroupTitle>
                <div className="site-grid gap-y-space-5">
                  {group.colors.map((color) => {
                    const alpha = alphaPercent(color.hex);
                    return (
                      <figure
                        key={color.name}
                        className="col-span-3 min-w-0 overflow-hidden rounded-4 border border-black-alpha-5 bg-secondary-pure-white shadow-base desktop:col-span-2"
                      >
                        <div className="h-space-18" style={alpha ? CHECKERBOARD : undefined}>
                          <div className="h-full" style={{ backgroundColor: `var(${color.token})` }} />
                        </div>
                        <figcaption className="p-space-3">
                          <span className="type-ui-xs-medium block break-words">{color.name}</span>
                          <span className="type-ui-2xs-regular mt-space-1 block text-black-alpha-70">
                            {color.hex}
                            {alpha ? `, ${alpha}` : ""}
                          </span>
                          {color.onColorsPage ? null : (
                            <span className="type-ui-2xs-regular mt-space-1 block text-black-alpha-70">{"note" in color ? color.note : "Variable only"}</span>
                          )}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="type"
          title="Type styles"
          intro="Every text style in the Figma file, at its exact Figma size."
        >
          <div className="flex flex-col gap-space-12">
            {TYPE_GROUPS.map(([group, label, sample]) => (
              <div key={group}>
                <GroupTitle>{label}</GroupTitle>
                {typeStyles
                  .filter((style) => style.group === group)
                  .map((style) => (
                    <SpecRow key={style.className} specimen={<div className={style.className}>{sample}</div>}>
                      <p className="type-ui-xs-medium break-words">{style.figmaName}</p>
                      <p className="type-ui-2xs-regular mt-space-1 break-words text-black-alpha-70">.{style.className}</p>
                      <p className="type-ui-2xs-regular mt-space-1 text-black-alpha-70">{describeStyle(style)}</p>
                    </SpecRow>
                  ))}
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="responsive"
          title="Responsive type"
          intro="Semantic defaults from the Figma Type Defaults and Legal Page Defaults frames. Size and line height scale between 390 and 1440 wide. Weight and tracking switch at 1024."
        >
          {semanticTypeStyles.map((style) => {
            const specimen = style.className.startsWith("type-list") ? (
              style.className.endsWith("unordered") ? (
                <ul className={style.className}>
                  <li>Selected by hand</li>
                  <li>Set in our studio</li>
                  <li>Finished to order</li>
                </ul>
              ) : (
                <ol className={style.className}>
                  <li>Choose a stone</li>
                  <li>Choose a setting</li>
                  <li>Review your ring</li>
                </ol>
              )
            ) : (
              <div className={style.className}>
                {style.label === "Body" || style.label === "Paragraph" || style.label === "Blockquote"
                  ? "Each stone is selected by hand and set in our studio."
                  : style.label}
              </div>
            );

            return (
              <SpecRow key={style.className} specimen={specimen}>
                <p className="type-ui-xs-medium">{style.label}</p>
                <p className="type-ui-2xs-regular mt-space-1 break-words text-black-alpha-70">.{style.className}</p>
                <p className="type-ui-2xs-regular mt-space-1 break-words text-black-alpha-70">
                  Desktop: {describeFigmaStyle(style.desktop)}
                </p>
                <p className="type-ui-2xs-regular mt-space-1 break-words text-black-alpha-70">
                  Figma tablet reference: {describeFigmaStyle(style.tablet)}
                </p>
                <p className="type-ui-2xs-regular mt-space-1 break-words text-black-alpha-70">
                  Mobile: {describeFigmaStyle(style.mobile)}
                </p>
              </SpecRow>
            );
          })}
        </Section>

        <Section id="grid" title="Grid" intro="Use the Show grid button at the bottom right to overlay the columns on this page.">
          {GRID_SPECS.map(([label, ...details]) => (
            <SpecRow key={label} specimen={<span className="type-ui-lg-regular">{label}</span>}>
              {details.map((detail) => (
                <p key={detail} className="type-ui-xs-regular mt-space-1 first:mt-0">
                  {detail}
                </p>
              ))}
            </SpecRow>
          ))}
        </Section>

        <Section id="effects" title="Effects">
          <GroupTitle>Shadows</GroupTitle>
          <div className="site-grid gap-y-space-8">
            {shadowTokens.map((shadow) => (
              <Tile key={shadow.name} label={shadow.name} detail={`.${shadow.utility}`}>
                <div className={`h-space-18 bg-secondary-pure-white ${shadow.utility}`} />
              </Tile>
            ))}
          </div>

          <div className="mt-space-12">
            <GroupTitle>Background blur</GroupTitle>
            <div className="site-grid gap-y-space-8">
              {blurTokens.map((blur) => (
                <Tile
                  key={blur.name}
                  label={blur.name}
                  detail={`.${blur.utility}, Figma radius ${blur.figmaRadius}, CSS ${blur.cssPx}px`}
                >
                  <div className="relative h-space-18 overflow-hidden rounded-4 bg-primary-leather">
                    <div className="absolute inset-y-0 left-1/4 w-space-6 bg-secondary-gold" />
                    <div className="absolute inset-y-0 left-2/3 w-space-3 bg-secondary-peach" />
                    <div className={`absolute inset-space-4 rounded-4 border border-white-alpha-20 bg-white-alpha-10 ${blur.utility}`} />
                  </div>
                </Tile>
              ))}
            </div>
          </div>

          <div className="mt-space-12">
            <GroupTitle>Text shadow</GroupTitle>
            <div className="site-grid gap-y-space-8">
              {textShadowTokens.map((shadow) => (
                <Tile key={shadow.name} label={shadow.name} detail={`.${shadow.utility}`}>
                  <div className="flex h-space-18 items-center justify-center rounded-4 bg-primary-hazel px-space-3">
                    <span className={`type-heading-caps-md text-base-white ${shadow.utility}`}>Sky</span>
                  </div>
                </Tile>
              ))}
            </div>
          </div>
        </Section>

        <Section
          id="spacing"
          title="Spacing and radius"
          intro="Spacing comes from the Figma Globals variables. Figma has no radius variables, so these radii are the common values on the Mobile - Approved page."
        >
          <GroupTitle>Spacing</GroupTitle>
          <ul className="flex flex-col gap-space-2">
            {spacingTokens.map((space) => (
              <li key={space.token} className="flex items-center gap-space-4">
                <span className="type-ui-2xs-regular w-space-19 shrink-0">
                  {space.utility}, {space.px}px
                </span>
                <span className="block h-space-3 bg-secondary-gold" style={{ width: `var(${space.token})` }} />
              </li>
            ))}
          </ul>

          <div className="mt-space-12">
            <GroupTitle>Radius</GroupTitle>
            <div className="site-grid gap-y-space-8">
              {radiusTokens.map((radius) => (
                <Tile key={radius.token} label={`${radius.px}px`} detail={`.${radius.utility}`}>
                  <div className={`h-space-18 border border-black-alpha-20 bg-secondary-ivory ${radius.utility}`} />
                </Tile>
              ))}
              <Tile label="Full" detail=".rounded-full, Figma 999 and 9999">
                <div className="h-space-18 rounded-full border border-black-alpha-20 bg-secondary-ivory" />
              </Tile>
            </div>
          </div>
        </Section>
      </main>
      <GridOverlay />
    </>
  );
}
