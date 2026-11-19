import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GridOverlay } from "@/components/styleguide/GridOverlay";
import { RemovableTagDemo } from "@/components/styleguide/ComponentDemos";
import { Badge } from "@/components/ui/Badge";
import { Button, HeroButton } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icon";
import { IconButton, IconLabelButton } from "@/components/ui/IconButton";
import { Input, InputMessage } from "@/components/ui/Input";
import {
  DiamondColorRadio,
  Radio,
  RadioButton,
  RadioGroup,
  RadioImageButton,
  RadioOption,
  RadioSelect,
} from "@/components/ui/Radio";
import type { PreviewState } from "@/components/ui/shared";
import { Tag } from "@/components/ui/Tag";
import { TextButton } from "@/components/ui/TextButton";
import { iconData, type IconName } from "@/icons/icon-data";

export const metadata: Metadata = {
  title: "Components",
  robots: { index: false, follow: false },
};

type StateSpec = { name: string; preview?: PreviewState; disabled?: boolean };

const BUTTON_STATES: StateSpec[] = [
  { name: "Default" },
  { name: "Hover", preview: "hover" },
  { name: "Pressed", preview: "pressed" },
  { name: "Disabled", disabled: true },
  { name: "Focus (added, not in Figma)", preview: "focus" },
];

const FIELD_STATES: Array<StateSpec & { error?: boolean }> = [
  { name: "Default" },
  { name: "Hover", preview: "hover" },
  { name: "Active", preview: "active" },
  { name: "Error", error: true },
  { name: "Disabled", disabled: true },
];

const SECTIONS = [
  ["button", "Button"],
  ["text-button", "Text Button"],
  ["icon-button", "Icon Button"],
  ["badge", "Badge"],
  ["tag", "Tag"],
  ["input", "Input"],
  ["radio", "Radio"],
  ["dropdown", "Dropdown"],
  ["icons", "Icons"],
  ["deviations", "Deviations from Figma"],
  ["held", "Held for review"],
] as const;

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "low", label: "Price (low to high)" },
  { value: "high", label: "Price (high to low)" },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-space-6 border-t border-base-black pt-space-8">
      <h2 id={`${id}-title`} className="type-heading-caps-lg">
        {title}
      </h2>
      <div className="mt-space-8 flex flex-col gap-space-10">{children}</div>
    </section>
  );
}

function Group({
  title,
  overlay = false,
  children,
}: {
  title: string;
  overlay?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="type-overline-sm-medium mb-space-4">{title}</h3>
      <div className={overlay ? "rounded-4 bg-primary-leather p-space-5 text-base-white" : undefined}>{children}</div>
    </div>
  );
}

function Row({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={
        wide
          ? "grid grid-cols-1 gap-x-space-6 gap-y-space-5 desktop:grid-cols-3"
          : "flex flex-wrap items-end gap-x-space-6 gap-y-space-5"
      }
    >
      {children}
    </div>
  );
}

function Item({ label, overlay = false, children }: { label: string; overlay?: boolean; children: ReactNode }) {
  return (
    <figure className="flex min-w-0 flex-col items-start gap-space-2">
      <div className="w-full">{children}</div>
      <figcaption className={`type-ui-2xs-regular break-words ${overlay ? "text-white-alpha-80" : "text-black-alpha-70"}`}>
        {label}
      </figcaption>
    </figure>
  );
}

const Placeholder = () => <span className="block size-full bg-secondary-peach" />;

function ButtonMatrix({ overlay = false }: { overlay?: boolean }) {
  return (
    <div className="flex flex-col gap-space-8">
      {(["md", "sm", "xs"] as const).flatMap((size) =>
        (["default", "secondary"] as const).map((variant) => (
          <Row key={`${size}-${variant}`}>
            {BUTTON_STATES.map((state) => (
              <Item
                key={state.name}
                overlay={overlay}
                label={`Size=${size.toUpperCase()}, Type=${variant === "default" ? "Default" : "Secondary"}, State=${state.name}`}
              >
                <Button size={size} variant={variant} overlay={overlay} previewState={state.preview} disabled={state.disabled}>
                  Button
                </Button>
              </Item>
            ))}
          </Row>
        )),
      )}
      <Row>
        <Item overlay={overlay} label="Left Icon=True">
          <Button overlay={overlay} leftIcon="plus">Button</Button>
        </Item>
        <Item overlay={overlay} label="Right Icon=True">
          <Button overlay={overlay} rightIcon="chevron-down">Button</Button>
        </Item>
      </Row>
    </div>
  );
}

function TextButtonMatrix({ overlay = false }: { overlay?: boolean }) {
  return (
    <div className="flex flex-col gap-space-6">
      {(["md", "sm"] as const).flatMap((size) =>
        (["default", "caps"] as const).map((variant) => (
          <Row key={`${size}-${variant}`}>
            {BUTTON_STATES.map((state) => (
              <Item
                key={state.name}
                overlay={overlay}
                label={`Size=${size.toUpperCase()}, Type=${variant === "caps" ? "Caps" : "Default"}, State=${state.name}`}
              >
                <TextButton
                  size={size}
                  variant={variant}
                  overlay={overlay}
                  leadingIcon="plus"
                  trailingIcon="arrow-right"
                  previewState={state.preview}
                  disabled={state.disabled}
                >
                  Button
                </TextButton>
              </Item>
            ))}
          </Row>
        )),
      )}
    </div>
  );
}

function IconButtonMatrix({ overlay = false }: { overlay?: boolean }) {
  const variants = [
    { variant: "primary" as const, name: overlay ? "Secondary" : "Primary", sizes: ["sm", "md", "lg"] as const },
    { variant: "ghost" as const, name: "Ghost", sizes: ["xs", "sm", "md", "lg"] as const },
  ];

  return (
    <div className="flex flex-col gap-space-6">
      {variants.flatMap(({ variant, name, sizes }) =>
        sizes.map((size) => (
          <Row key={`${variant}-${size}`}>
            {BUTTON_STATES.map((state) => (
              <Item
                key={state.name}
                overlay={overlay}
                label={`Size=${size.toUpperCase()}, Type=${name}, State=${state.name}`}
              >
                <IconButton
                  icon="plus"
                  label={`Add, ${name} ${size} ${state.name}`}
                  size={size}
                  variant={variant}
                  overlay={overlay}
                  previewState={state.preview}
                  disabled={state.disabled}
                />
              </Item>
            ))}
          </Row>
        )),
      )}
    </div>
  );
}

function InputMatrix({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-col gap-space-8">
      {(["md", "sm"] as const).flatMap((size) =>
        ([false, true] as const).map((filled) => (
          <Row wide key={`${size}-${filled}`}>
            {FIELD_STATES.map((state) => (
              <Item
                key={state.name}
                overlay={dark}
                label={`Size=${size.toUpperCase()}, Filled=${filled ? "True" : "False"}, State=${state.name === "Disabled" ? "DIsabled" : state.name}`}
              >
                <Input
                  label="First name"
                  size={size}
                  dark={dark}
                  defaultValue={filled ? "Input text" : undefined}
                  previewState={state.preview}
                  error={state.error}
                  disabled={state.disabled}
                />
              </Item>
            ))}
          </Row>
        )),
      )}
    </div>
  );
}

function DropdownMatrix({ overlay = false }: { overlay?: boolean }) {
  return (
    <div className="flex flex-col gap-space-8">
      {(["md", "sm", "xs"] as const).flatMap((size) =>
        ([false, true] as const).map((selected) => (
            <Row wide key={`${size}-${selected}`}>
              {FIELD_STATES.map((state) => (
                <Item
                  key={state.name}
                  overlay={overlay}
                  label={`Size=${size.toUpperCase()}, State=${state.name}, Selected=${selected ? "True" : "False"}`}
                >
                  <Dropdown
                    label={`Sort, ${size} ${state.name} ${selected ? "selected" : "empty"}`}
                    placeholder="Input text"
                    options={OPTIONS}
                    size={size}
                    overlay={overlay}
                    leadingIcon={selected ? undefined : "search"}
                    clearable={selected}
                    displayValue={selected ? "Metals (1)" : undefined}
                    previewState={state.preview}
                    error={state.error}
                    disabled={state.disabled}
                  />
                </Item>
              ))}
            </Row>
          )),
      )}
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <>
      <main className="site-container flex flex-col gap-space-15 py-space-13">
        <header>
          <p className="type-overline-sm-medium">Sky Jewelry design system v1.0</p>
          <h1 className="mt-space-3">Components</h1>
          <p className="type-body-sm-regular mt-space-3 max-w-[40rem] text-black-alpha-70">
            Batch 1, labeled with Figma variant names. Hover, Pressed, Active and Focus are forced here so states sit side by side.
          </p>
          <nav aria-label="Component sections" className="mt-space-6">
            <ul className="flex flex-wrap gap-x-space-5 gap-y-space-1">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="type-ui-sm-link inline-block py-space-1">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/styleguide/" className="type-ui-sm-link inline-block py-space-1">
                  Style guide
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <Section id="button" title="Button">
          <Group title="Button"><ButtonMatrix /></Group>
          <Group title="Button - Overlay" overlay><ButtonMatrix overlay /></Group>
          <Group title="Hero Button">
            <Row wide>
              <Item label="State=Default, Size=LG"><HeroButton href="#button">Shop Rings</HeroButton></Item>
              <Item label="State=Hover, Size=LG"><HeroButton href="#button" previewState="hover">Shop Rings</HeroButton></Item>
            </Row>
          </Group>
          <Group title="Hero Button - Overlay" overlay>
            <Row wide>
              <Item overlay label="State=Default, Size=LG"><HeroButton overlay href="#button">Shop Rings</HeroButton></Item>
              <Item overlay label="State=Hover, Size=LG"><HeroButton overlay href="#button" previewState="hover">Shop Rings</HeroButton></Item>
              <Item overlay label="State=Default, Size=SM"><HeroButton overlay size="sm" href="#button">Shop Rings</HeroButton></Item>
              <Item overlay label="State=Pressed, Size=SM"><HeroButton overlay size="sm" href="#button" previewState="pressed">Shop Rings</HeroButton></Item>
            </Row>
          </Group>
        </Section>

        <Section id="text-button" title="Text Button">
          <Group title="Text Button"><TextButtonMatrix /></Group>
          <Group title="Text Button - Overlay" overlay><TextButtonMatrix overlay /></Group>
        </Section>

        <Section id="icon-button" title="Icon Button">
          <Group title="Icon Button"><IconButtonMatrix /></Group>
          <Group title="Icon Button - Overlay" overlay><IconButtonMatrix overlay /></Group>
          <Group title="Icon Label Button">
            <Row>
              {(["stack", "row"] as const).flatMap((layout) =>
                [{ name: "Default" }, { name: "Hover", preview: "hover" as const }].map((state) => (
                  <Item key={`${layout}-${state.name}`} label={`Type=${layout === "stack" ? "Stack" : "Row"}, State=${state.name}`}>
                    <IconLabelButton icon="mail" layout={layout} previewState={state.preview}>Drop a hint</IconLabelButton>
                  </Item>
                )),
              )}
            </Row>
          </Group>
        </Section>

        <Section id="badge" title="Badge">
          <Group title="Badge">
            <div className="flex flex-col gap-space-5">
              {(["md", "sm", "xs"] as const).map((size) => (
                <Row key={size}>
                  {(["primary", "secondary", "error", "success", "transparent"] as const).map((variant) => (
                    <Item key={variant} label={`Size=${size.toUpperCase()}, Type=${variant[0].toUpperCase()}${variant.slice(1)}`}>
                      <Badge size={size} variant={variant} icon="round">Badge</Badge>
                    </Item>
                  ))}
                </Row>
              ))}
            </div>
          </Group>
          <Group title="Badge - Overlay" overlay>
            <div className="flex flex-col gap-space-5">
              {(["md", "sm", "xs"] as const).map((size) => (
                <Row key={size}>
                  {(["primary", "secondary"] as const).map((variant) => (
                    <Item overlay key={variant} label={`Size=${size.toUpperCase()}, Type=${variant === "primary" ? "Primary" : "Secondary"}`}>
                      <Badge size={size} variant={variant} overlay>Badge</Badge>
                    </Item>
                  ))}
                </Row>
              ))}
            </div>
          </Group>
        </Section>

        <Section id="tag" title="Tag">
          <Group title="Tag">
            <Row>
              {(["md", "sm"] as const).flatMap((size) =>
                (["primary", "secondary"] as const).map((color) => (
                  <Item key={`${size}-${color}`} label={`Size=${size.toUpperCase()}, Color=${color === "primary" ? "Primary" : "Secondary"}`}>
                    <Tag size={size} color={color} leadingIcon="round" trailingIcon="close">Tag</Tag>
                  </Item>
                )),
              )}
              <Item label="With working remove button (added)"><RemovableTagDemo /></Item>
            </Row>
          </Group>
        </Section>

        <Section id="input" title="Input">
          <Group title="Input"><InputMatrix /></Group>
          <Group title="Input - Dark" overlay><InputMatrix dark /></Group>
          <Group title="Icons and message">
            <Row wide>
              <Item label="Left Icon=True, Right Icon=True"><Input label="Search" leftIcon="search" rightIcon="close" /></Item>
              <Item label="State=Error with input-message">
                <Input label="Email" type="email" defaultValue="rob@" error message="Please provide a valid email address." />
              </Item>
            </Row>
          </Group>
          <Group title="input-message">
            <Row wide>
              {(["error", "info", "success"] as const).map((status) => (
                <Item key={status} label={`Status=${status[0].toUpperCase()}${status.slice(1)}, Size=MD`}>
                  <InputMessage status={status}>Please provide a valid value.</InputMessage>
                </Item>
              ))}
            </Row>
          </Group>
        </Section>

        <Section id="radio" title="Radio">
          <Group title="Radio">
            <Row>
              {(["default", "success"] as const).flatMap((color) =>
                [
                  { name: "Default" },
                  { name: "Hover", preview: "hover" as const },
                  { name: "Active", checked: true },
                ].map((state) => (
                  <Item key={`${color}-${state.name}`} label={`State=${state.name}, Color=${color === "default" ? "Default" : "Success"}`}>
                    <Radio name={`radio-${color}-${state.name}`} label={`${color} ${state.name}`} color={color} previewState={state.preview} defaultChecked={state.checked} />
                  </Item>
                )),
              )}
            </Row>
          </Group>
          <Group title="Radio Option">
            <Row wide>
              {(["default", "success"] as const).flatMap((color) =>
                [
                  { name: "Default" },
                  { name: "Hover", preview: "hover" as const },
                  { name: "Active", checked: true },
                ].map((state) => (
                  <Item key={`${color}-${state.name}`} label={`State=${state.name}, Color=${color === "default" ? "Default" : "Success"}, Heading?=True`}>
                    <RadioOption name={`option-${color}-${state.name}`} color={color} heading="This is a heading" previewState={state.preview} defaultChecked={state.checked}>
                      This is an option
                    </RadioOption>
                  </Item>
                )),
              )}
            </Row>
          </Group>
          <Group title="Radio Select">
            <Row wide>
              {(["default", "success"] as const).flatMap((color) =>
                [
                  { name: "Default" },
                  { name: "Hover", preview: "hover" as const },
                  { name: "Active", checked: true },
                ].map((state) => (
                  <Item key={`${color}-${state.name}`} label={`State=${state.name}, Color=${color === "default" ? "Default" : "Success"}`}>
                    <RadioSelect name={`select-${color}-${state.name}`} color={color} heading="This is a heading" price="$89.00" previewState={state.preview} defaultChecked={state.checked}>
                      This is an option
                    </RadioSelect>
                  </Item>
                )),
              )}
            </Row>
          </Group>
          <Group title="Radio Button">
            <Row>
              {[
                { size: "md" as const, name: "Inactive" },
                { size: "md" as const, name: "Hover", preview: "hover" as const },
                { size: "md" as const, name: "Active", checked: true },
                { size: "sm" as const, name: "Inactive" },
                { size: "sm" as const, name: "Pressed", preview: "pressed" as const },
                { size: "sm" as const, name: "Active", checked: true },
              ].map((state) => (
                <Item key={`${state.size}-${state.name}`} label={`State=${state.name}, Size=${state.size.toUpperCase()}`}>
                  <RadioButton name={`tile-${state.size}-${state.name}`} size={state.size} previewState={state.preview} defaultChecked={state.checked}>Stone</RadioButton>
                </Item>
              ))}
            </Row>
          </Group>
          <Group title="Radio Button - Image (placeholder media)">
            <Row wide>
              {[
                { size: "lg" as const, name: "Inactive" },
                { size: "lg" as const, name: "Hover", preview: "hover" as const },
                { size: "lg" as const, name: "Active", checked: true },
                { size: "md" as const, name: "Inactive" },
                { size: "md" as const, name: "Hover", preview: "hover" as const },
                { size: "md" as const, name: "Active", checked: true },
                { size: "sm" as const, name: "Inactive" },
                { size: "sm" as const, name: "Pressed", preview: "pressed" as const },
                { size: "sm" as const, name: "Active", checked: true },
              ].map((state) => (
                <Item key={`${state.size}-${state.name}`} label={`State=${state.name}, Size=${state.size.toUpperCase()}`}>
                  <RadioImageButton name={`image-${state.size}-${state.name}`} size={state.size} media={<Placeholder />} previewState={state.preview} defaultChecked={state.checked}>
                    Stone
                  </RadioImageButton>
                </Item>
              ))}
            </Row>
          </Group>
          <Group title="Diamond Color Radio Button">
            <Row>
              <Item label="Property 1=Default"><DiamondColorRadio name="gem-default" gemColor="#2a2a2a">Black</DiamondColorRadio></Item>
              <Item label="Property 1=Active"><DiamondColorRadio name="gem-active" gemColor="#2a2a2a" defaultChecked>Black</DiamondColorRadio></Item>
            </Row>
          </Group>
          <Group title="Working group: arrow keys move the selection">
            <RadioGroup legend="Delivery" className="max-w-[22.5rem]">
              <div className="flex flex-col gap-space-2">
                <RadioSelect name="delivery" heading="Standard" price="$0.00" defaultChecked>Ships in 2-3 weeks</RadioSelect>
                <RadioSelect name="delivery" heading="Express" price="$89.00">Ships in 1 week</RadioSelect>
                <RadioSelect name="delivery" heading="Pickup" price="$0.00" disabled>Not available</RadioSelect>
              </div>
            </RadioGroup>
          </Group>
        </Section>

        <Section id="dropdown" title="Dropdown">
          <Group title="Dropdown"><DropdownMatrix /></Group>
          <Group title="Dropdown - Overlay (XS Selected=True: see Deviations)" overlay><DropdownMatrix overlay /></Group>
          <Group title="Figma examples: open to use with mouse or keyboard">
            <div className="grid grid-cols-1 items-start gap-x-space-6 gap-y-space-5 desktop:grid-cols-3">
              <Item label="Example - Basic"><Dropdown label="Basic" options={OPTIONS} /></Item>
              <Item label="Example - Dropdown Search"><Dropdown label="Search" options={OPTIONS} leadingIcon="search" groupLabel="Group Label" /></Item>
              <Item label="Example - Option Selected"><Dropdown label="Sort by" options={OPTIONS} defaultValue="high" /></Item>
              <Item label="Example - Radio Select">
                <Dropdown
                  label="Metal"
                  displayValue="Metals (1)"
                  clearable
                  groupLabel="Select Metal"
                  panelLabel="Select metal"
                  panel={
                    <RadioGroup legend="Metal" hideLegend>
                      <div className="flex flex-wrap gap-space-2 px-space-3 py-space-2">
                        {["White Gold", "Yellow Gold", "Rose Gold", "Platinum"].map((metal, index) => (
                          <RadioButton key={metal} name="metal" size="sm" defaultChecked={index === 1}>{metal}</RadioButton>
                        ))}
                      </div>
                    </RadioGroup>
                  }
                />
              </Item>
            </div>
          </Group>
        </Section>

        <Section id="icons" title="Icons">
          <ul className="flex flex-wrap gap-space-5">
            {(Object.keys(iconData) as IconName[]).map((name) => (
              <li key={name} className="flex w-24 flex-col items-center gap-space-2 text-center">
                <Icon name={name} size={32} accentColor={name === "gemstone-color" ? "#2a2a2a" : undefined} />
                <span className="type-ui-2xs-regular break-words">{name}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="deviations" title="Deviations from Figma">
          <ul className="type-body-sm-regular flex max-w-[48rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>
              Input empty label (placeholder): Figma uses black-alpha-50, 3.42:1 on secondary/skin, which fails WCAG AA. Built with
              black-alpha-60, 4.70:1.
            </li>
            <li>
              Input - Dark empty label: Figma uses white-alpha-50, 4.16:1 on white-alpha-2 over primary/leather, which fails WCAG AA. Built
              with white-alpha-60, 5.26:1.
            </li>
            <li>
              Dropdown - Overlay, Size=XS, Selected=True: the Figma frame is broken, with dividers missing, the wrong length or pasted as
              images. Built with the SM and MD pattern: a 1px white-alpha-20 divider, 12px tall at XS.
            </li>
            <li>Focus rings: Figma defines no focus state. A 2px ring is added, leather on light surfaces and white on overlays.</li>
          </ul>
        </Section>

        <Section id="held" title="Held for review">
          <ul className="type-body-sm-regular flex max-w-[40rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>Shop All: a checkout bar with a price. Planned for the bag and checkout tasks.</li>
            <li>Quanity Select: variants are unnamed. Planned for the bag and checkout tasks.</li>
            <li>Dropdown Example - Price: needs a Slider. Planned for the product-list filter task.</li>
          </ul>
        </Section>
      </main>
      <GridOverlay />
    </>
  );
}
