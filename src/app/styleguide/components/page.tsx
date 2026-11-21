import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
import { AccountDemos } from "@/components/styleguide/AccountDemos";
import { BagDemos } from "@/components/styleguide/BagDemos";
import { BuilderDemos } from "@/components/styleguide/BuilderDemos";
import { CompleteDemos } from "@/components/styleguide/CompleteDemos";
import { getBuilderCatalog } from "@/lib/builder";
import { getEarringsCatalog } from "@/lib/earrings";
import { EarringsDemos } from "@/components/styleguide/EarringsDemos";
import { MegaMenuPanel } from "@/components/site/MegaMenu";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { DyoCard } from "@/components/ui/DyoCard";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PostCard } from "@/components/ui/PostCard";
import { ProductCardSummary } from "@/components/ui/ProductCardSummary";
import { getMockProducts } from "@/lib/mockCatalog";
import { ButtonCard } from "@/components/ui/ButtonCard";
import { IconBlock } from "@/components/ui/IconBlock";
import { ImageBlock } from "@/components/ui/ImageBlock";
import { CompositionChart, DimensionsDiagram, InfoScale, ProductInfoCard } from "@/components/ui/ProductInfoCard";
import { GradeScale, QualityCard } from "@/components/ui/QualityCard";
import { Viewer360 } from "@/components/ui/Viewer360";
import { SHOW_360 } from "@/lib/features";
import { CtaCalloutSection } from "@/components/sections/LandingSections";
import { ButtonText } from "@/components/ui/Button";
import { gradeScales, metalComposition, productDetailContent } from "@/content/product-detail";
import { ResourceCardLarge, ResourceCardSmall } from "@/components/ui/ResourceCard";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { SearchPanel } from "@/components/site/SearchPanel";
import { siteHeader } from "@/content/site";
import { NavItem } from "@/components/site/NavItem";
import { Newsletter } from "@/components/site/Newsletter";
import { GridOverlay } from "@/components/styleguide/GridOverlay";
import {
  ModalDemo,
  PaginationDemo,
  PaginationDotsDemo,
  RemovableTagDemo,
  CheckboxDemo,
  NumberFieldDemo,
  OptionTileDemo,
  ProductCardDemo,
  RangeFieldDemo,
  GalleryTabsDemo,
} from "@/components/styleguide/ComponentDemos";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ModalPanel } from "@/components/ui/Modal";
import { PaginationNumber } from "@/components/ui/Pagination";
import { ScrollArea, Scrollbar } from "@/components/ui/Scrollbar";
import { StatusMarker } from "@/components/ui/StatusMarker";
import { StepActionLink, StepIndicator, StepList } from "@/components/ui/StepIndicator";
import { TabItemPreview, Tabs } from "@/components/ui/Tabs";
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
  ["filter-controls", "Range slider and filters"],
  ["product-detail", "Product detail"],
  ["landing", "Landing page blocks"],
  ["accordion", "Accordion"],
  ["modal", "Modal"],
  ["tabs", "Tabs"],
  ["pagination", "Pagination"],
  ["step-indicator", "Step Indicator"],
  ["status", "Status"],
  ["scrollbar", "Scrollbar"],
  ["cards", "Cards"],
  ["site-chrome", "Header and footer"],
  ["bag", "Bag"],
  ["account", "Account"],
  ["ring-builder", "Ring builder"],
  ["earrings-builder", "Earrings builder"],
  ["icons", "Icons"],
  ["deviations", "Deviations from Figma"],
  ["corrected-oversights", "Corrected design oversights"],
  ["kept-as-figma", "Kept as Figma"],
  ["open-questions", "Open questions"],
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
  surface = "navy",
  children,
}: {
  title: string;
  overlay?: boolean;
  /** Figma's frame color behind the overlay set: base/black (navy) for most, primary/leather for a few. */
  surface?: "navy" | "leather";
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="type-overline-sm-medium mb-space-4">{title}</h3>
      <div
        className={
          overlay
            ? `rounded-4 p-space-5 text-base-white ${surface === "leather" ? "bg-primary-leather" : "bg-base-black"}`
            : undefined
        }
      >
        {children}
      </div>
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

const productCardSample = getMockProducts().find((product) => product.slug === "vine-natural-diamond-ring")!;

export default async function ComponentsPage() {
  // Catalogue samples for the Ring builder section.
  const builder = await getBuilderCatalog();
  const builderSetting = builder.settings.find((setting) => setting.handle === "vine-engagement-ring-setting") ?? builder.settings[0];
  const roundStone = builder.stones.find((stone) => stone.kind === "diamond" && stone.shape === "round" && stone.certificate === "GIA") ?? builder.stones[0];
  const drawnStone = builder.stones.find((stone) => !stone.image) ?? builder.stones[0];
  const otherLabStone = builder.stones.find((stone) => stone.kind === "diamond" && stone.certificate !== "GIA") ?? builder.stones[0];
  // Catalogue samples for the Earrings builder section.
  const earringsCatalog = await getEarringsCatalog();
  const earringSetting = earringsCatalog.settings[0];
  const earringPair = earringsCatalog.pairs.find((pair) => pair.shape === "round") ?? earringsCatalog.pairs[0];
  return (
    <>
      <main id="main-content" tabIndex={-1} className="site-container flex flex-col gap-space-15 py-space-13">
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

        <Section id="filter-controls" title="Range slider and filters">
          <p className="type-body-sm-regular max-w-[48rem]">
            From the product list frames (Price dropdown 5958:57571, Filters sheet 5746:89744) and the Dropdown page (Quantity Selector,
            Slider). The slider handles are keyboard sliders: arrows move one step, Page Up and Page Down ten, Home and End to the ends. The
            number fields take typed values (Enter or leaving the field applies them), and Arrow Up and Arrow Down step them.
          </p>
          <Group title="Range Slider with number fields">
            <div className="flex flex-wrap items-start gap-space-10">
              <Item label="Price: no steppers (step $100)"><RangeFieldDemo kind="price" /></Item>
              <Item label="Carat: Quantity Selector steppers (step 0.05)"><RangeFieldDemo kind="carat" /></Item>
            </div>
          </Group>
          <Group title="Quantity Selector, Size=LG">
            <div className="flex flex-wrap items-start gap-space-10">
              <Item label="Without stepper (Price)"><NumberFieldDemo /></Item>
              <Item label="With stepper (Carat)"><NumberFieldDemo stepper /></Item>
            </div>
          </Group>
          <Group title="Checkbox Option, Size=SM">
            <Item label="Chain Length, multi-select"><CheckboxDemo /></Item>
          </Group>
          <Group title="Filter tiles (Radio Button SM)">
            <div className="flex flex-col items-start gap-space-8">
              <Item label="Metal tiles: multi-select, as in the desktop Metal panel (the Filters sheet scrolls them in one row)">
                <span id="demo-metal-tiles" className="sr-only">Metal</span>
                <OptionTileDemo kind="metal" />
              </Item>
              <Item label="Text tiles: Diamond Type"><OptionTileDemo kind="text" /></Item>
              <Item label="Compact tiles: quick view Carat Weight, single choice"><OptionTileDemo kind="compact" /></Item>
            </div>
          </Group>
        </Section>

        <Section id="product-detail" title="Product detail">
          <p className="type-body-sm-regular max-w-[48rem]">
            Components from the Product Detail frames (desktop 3565:98309, mobile 3587:127126) and the Cards, Icon Block and Image Block
            pages. Values shown here are the page&rsquo;s sample data.
          </p>
          <Group title="Icon Block, Type=Default (MD desktop, SM mobile)">
            <div className="flex w-[31.625rem] max-w-full gap-space-2">
              {productDetailContent.iconRow.map((item) => (
                <IconBlock key={item._key} icon={item.icon} label={item.label} lines={item.lines} />
              ))}
            </div>
          </Group>
          <Group title="Product Info Card">
            <div className="grid w-[31.625rem] max-w-full grid-cols-2 items-start gap-space-3">
              <Item label="Chart (metal composition, from data)">
                <ProductInfoCard label="Metal" value="14K Yellow Gold" note="Percentages by weight." gap="md">
                  <CompositionChart parts={metalComposition["14k-yellow-gold"]} />
                </ProductInfoCard>
              </Item>
              <Item label="Default (stat)"><ProductInfoCard label="Carat" value="0.80" note="The weight of the center stone." /></Item>
              <Item label="Scale, Color">
                <ProductInfoCard label="Color" value="I" note="Nearly colorless"><InfoScale kind="color" position={0.58} label="Color I" /></ProductInfoCard>
              </Item>
              <Item label="Scale, Clarity (noise recreated in SVG)">
                <ProductInfoCard label="Clarity" value="VVS2" note="Inclusions are extremely difficult to see"><InfoScale kind="clarity" position={0.34} label="Clarity VVS2" /></ProductInfoCard>
              </Item>
              <Item label="Dimensions (diagram on mobile only)">
                <ProductInfoCard label="Dimensions (mm)" value="6.03 × 6.03" note={<span className="block text-right">Ratio: 1.00</span>}><DimensionsDiagram /></ProductInfoCard>
              </Item>
              <Item label="Certification"><ProductInfoCard label="Certification" value="GIA" note={<span className="underline">View Certificate</span>} /></Item>
            </div>
          </Group>
          <Group title="Quality card and Grade Scale (read-only)">
            <div className="flex flex-wrap items-start gap-space-6">
              <Item label="Your Diamond’s Qualities card">
                <div className="w-[25rem] max-w-full">
                  <QualityCard title="Clarity" grade="VVS2" options={gradeScales.clarity.options} illustration={gradeScales.clarity.illustration} description={gradeScales.clarity.grades.VVS2.description} />
                </div>
              </Item>
              <Item label="Grade Scale on its own">
                <div className="w-[22rem] max-w-full"><GradeScale label="Cut grade scale" options={gradeScales.cut.options} selected="Excellent" /></div>
              </Item>
            </div>
          </Group>
          <Group title="Image Block and Button Card">
            <div className="flex flex-wrap items-start gap-space-6">
              <Item label="Image Block">
                <div className="w-[18rem]">
                  <ImageBlock image={productDetailContent.box.items[0].image} caption={productDetailContent.box.items[0].caption} sizes={{ desktop: "288px", mobile: "288px" }} imageClassName="aspect-square" />
                </div>
              </Item>
              <Item label="Button Card (overlay 30% desktop, 50% mobile, as Figma)">
                <div className="w-[21.875rem] max-w-full">
                  <ButtonCard {...productDetailContent.buttonCards[1]} sizes={{ desktop: "350px", mobile: "350px" }} className="aspect-[350/438]" />
                </div>
              </Item>
            </div>
          </Group>
          <Group title="Asset Tabs and 360° viewer">
            <div className="flex flex-wrap items-start gap-space-6">
              <Item label="Tabs - Line with the full-width rule (mobile gallery; the earrings pair page’s labels while the 360° switch is off)"><GalleryTabsDemo /></Item>
              {SHOW_360 ? (
                <Item label="360° viewer: drag, or focus and use the arrow keys. DEMO frames only (three vine ring photos); no product has a 360° sequence yet">
                  <div className="aspect-square w-[21.875rem] max-w-full overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
                    <Viewer360
                      label="Demo 360° viewer"
                      sizes={{ desktop: "350px", mobile: "350px" }}
                      frames={[
                        { desktop: "product-ring-vine-white-gold", alt: "" },
                        { desktop: "product-ring-vine-yellow-gold", alt: "" },
                        { desktop: "product-ring-vine-rose-gold", alt: "" },
                      ]}
                    />
                  </div>
                </Item>
              ) : (
                <Item label="360° viewer and marker: switched off (SHOW_360 in src/lib/features.ts) until 360 image sequences exist">
                  <p className="type-body-sm-regular max-w-[21.875rem] text-black-alpha-70">
                    The viewer and Figma&rsquo;s 360 marker are kept in the code and render nothing while the switch is off. Turning it on is a
                    one-line change.
                  </p>
                </Item>
              )}
            </div>
          </Group>
        </Section>

        <Section id="landing" title="Landing page blocks">
          <p className="type-body-sm-regular max-w-[48rem]">
            New pieces from the five category landing pages (Figma 3565:97085 to 3565:97781). The sections themselves (tile carousels,
            guarantee icons, feature card rows, best sellers, button card pairs, Diamond Inspection) are assembled from these on the
            landing pages.
          </p>
          <Group title="CTA Callout (CTA Banner page): mobile is the Design System variant, desktop the landing frames' larger copy">
            <div className="-mx-(--grid-margin)">
              <CtaCalloutSection content={{ _type: "ctaCallout", _key: "demo", eyebrow: "Sale", title: "Up to 20% Off Natural Diamonds", cta: { label: "Shop Now", href: "#landing" } }} />
            </div>
          </Group>
          <Group title="Icon Block with body: Type=Default MD (desktop) and Type=Row XS (mobile)">
            <div className="flex max-w-[48rem] flex-col gap-space-6 ui-desktop:flex-row">
              <IconBlock icon="warranty" label="Lifetime Warranty" body="Every piece is covered for life." layout="row-on-mobile" />
              <IconBlock icon="money-back-guarantee" label="Money Back Guarantee" body="Returns are free within 30 days." layout="row-on-mobile" />
              <IconBlock icon="diamond-experts" label="Diamond Experts" body="Ask our specialists before you choose." layout="row-on-mobile" />
            </div>
          </Group>
          <Group title="Product Card - Summary without price, and name only">
            <div className="flex flex-wrap items-start gap-space-6">
              <Item label="Shape tile (name and body)">
                <div className="w-[18.375rem]">
                  <ProductCardSummary name="Round" body="A circular brilliant cut." href="#landing" image={{ desktop: "shape-round-sq", alt: "" }} sizes={{ desktop: "294px", mobile: "290px" }} />
                </div>
              </Item>
              <Item label="Metal tile (name only)">
                <div className="w-[18.375rem]">
                  <ProductCardSummary name="Rose Gold" href="#landing" image={{ desktop: "product-ring-vine-rose-gold", alt: "" }} sizes={{ desktop: "294px", mobile: "290px" }} />
                </div>
              </Item>
            </div>
          </Group>
          <Group title="Feature Card: title only on mobile (CTA from 1024px), and compact caption with body">
            <div className="flex flex-wrap items-start gap-space-6">
              <Item label="ctaOnMobile false">
                <FeatureCard title="Rings" ctaLabel="Shop Now" href="#landing" ctaOnMobile={false} image={{ desktop: "fc-rings-fc", alt: "" }} sizes={{ desktop: "294px", mobile: "171px" }} className="aspect-[294/367] w-[18.375rem]" />
              </Item>
              <Item label="compact (16px caption padding)">
                <FeatureCard title="Birthday" body="Mark the moment with personalized pieces, birthstones, or classic everyday luxury." ctaLabel="Shop Now" href="#landing" compact image={{ desktop: "fc-birthday-fc", alt: "" }} sizes={{ desktop: "294px", mobile: "288px" }} className="aspect-[294/367] w-[18.375rem]" />
              </Item>
            </div>
          </Group>
          <Group title="Inert button (plain text styled as a Button): actions with nothing to connect to yet">
            <div className="flex flex-wrap items-center gap-space-4">
              <ButtonText variant="secondary" size="responsive">Start a live chat</ButtonText>
              <span className="type-body-xs-regular text-black-alpha-70">Read as text by screen readers; takes no focus.</span>
            </div>
          </Group>
        </Section>

        <Section id="accordion" title="Accordion">
          <Group title="Accordion Item">
            <div className="flex flex-col gap-space-8">
              {(["desktop", "mobile"] as const).map((breakpoint) => (
                <Row wide key={breakpoint}>
                  {[
                    { name: "Active=False, State=Default", open: false },
                    ...(breakpoint === "desktop" ? [{ name: "Active=False, State=Hover", open: false, preview: "hover" as const }] : []),
                    { name: "Active=True, State=Default", open: true },
                    ...(breakpoint === "desktop" ? [{ name: "Active=True, State=Hover", open: true, preview: "hover" as const }] : []),
                  ].map((state) => (
                    <Item key={state.name} label={`${state.name}, Breakpoint=${breakpoint === "desktop" ? "Desktop" : "Mobile"}`}>
                      <AccordionItem
                        question={
                          <>
                            Vitae at egestas integer
                            <span className="sr-only">
                              {" "}
                              ({state.name}, {breakpoint})
                            </span>
                          </>
                        }
                        breakpoint={breakpoint}
                        defaultOpen={state.open}
                        previewState={state.preview}
                      >
                        Dignissim vivamus pharetra tellus sit in pharetra. Ac sed mauris quam nunc.
                      </AccordionItem>
                    </Item>
                  ))}
                </Row>
              ))}
              <Row wide>
                <Item label="Show Icon=True">
                  <AccordionItem question="Shipping and returns" icon="truck">
                    Free insured shipping on every order.
                  </AccordionItem>
                </Item>
              </Row>
            </div>
          </Group>
          <Group title="Working demo: click or use Enter and Space">
            <Accordion className="max-w-[49rem]">
              <AccordionItem question="How long does shipping take?" icon="truck">
                Most rings ship in 2 to 3 weeks. You will get tracking details by email.
              </AccordionItem>
              <AccordionItem question="Can I resize my ring later?">
                Resizing is free for 60 days after purchase.
              </AccordionItem>
              <AccordionItem question="Do you offer care plans?">
                Care plans cover cleaning, polishing and stone tightening.
              </AccordionItem>
            </Accordion>
          </Group>
        </Section>

        <Section id="modal" title="Modal">
          <Group title="Modal - Default (static previews)">
            <div className="flex flex-col gap-space-8">
              {(["desktop", "mobile"] as const).flatMap((breakpoint) =>
                (["row", "stack"] as const).map((layout) => (
                  <Item
                    key={`${breakpoint}-${layout}`}
                    label={`Breakpoint=${breakpoint === "desktop" ? "Desktop" : "Mobile"}, ${layout === "row" ? "Button Group=True" : "Button Stack=True, Show Icon=True"}, Show Close=True`}
                  >
                    <div className={breakpoint === "desktop" ? "max-w-[30rem]" : "max-w-[24.375rem]"}>
                      <ModalPanel
                        breakpoint={breakpoint}
                        heading="Are you sure you want to remove this item?"
                        body="This removes the ring from your bag. You can add it again at any time."
                        icon={layout === "stack" ? <Icon name="alert" size={breakpoint === "desktop" ? 64 : 48} className="text-state-error" /> : undefined}
                        actionsLayout={layout}
                        secondaryAction={{ label: "Cancel" }}
                        primaryAction={{ label: "Remove" }}
                      />
                    </div>
                  </Item>
                )),
              )}
            </div>
          </Group>
          <Group title="Working demo: Tab stays inside, Escape or the backdrop closes, focus returns here">
            <Row>
              <ModalDemo />
              <ModalDemo layout="stack" />
            </Row>
          </Group>
        </Section>

        <Section id="tabs" title="Tabs">
          {[false, true].map((overlay) => (
            <Group key={String(overlay)} title={overlay ? "Tab Item - Overlay" : "Tab Item"} overlay={overlay} surface="leather">
              <div className="flex flex-col gap-space-6">
                {[
                  ...(["md", "sm", "xs"] as const).map((size) => ({ size, type: "pill" as const })),
                  { size: "sm" as const, type: "line" as const },
                ].map(({ size, type }) => (
                  <Row key={`${type}-${size}`}>
                    {[
                      { name: "Default" },
                      { name: "Hover", state: "hover" as const },
                      { name: "Active", state: "active" as const },
                      { name: "Disabled", state: "disabled" as const },
                    ].map((state) => (
                      <Item
                        key={state.name}
                        overlay={overlay}
                        label={`Size=${size.toUpperCase()}, State=${state.name}, Type=${type === "pill" ? "Pill" : "Line"}`}
                      >
                        <TabItemPreview label="Tab Item" size={size} variant={type} overlay={overlay} state={state.state} />
                      </Item>
                    ))}
                  </Row>
                ))}
              </div>
            </Group>
          ))}
          <Group title="Tabs and Tabs - Line: arrow keys move between tabs">
            <div className="flex flex-col gap-space-6">
              {(["md", "sm", "xs"] as const).map((size) => (
                <Item key={size} label={`Tabs, Size=${size.toUpperCase()}`}>
                  <Tabs
                    label={`Ring styles, ${size}`}
                    size={size}
                    items={["Solitaire", "Halo", "Pave", "Three Stone", "Vintage"].map((label) => ({ id: label, label }))}
                  />
                </Item>
              ))}
              {(["md", "sm"] as const).map((size) => (
                <Item key={`line-${size}`} label={`Tabs - Line, Size=${size.toUpperCase()}`}>
                  <Tabs
                    label={`Details, ${size}`}
                    variant="line"
                    size={size}
                    items={[
                      { id: "details", label: "Details", panel: <p className="type-paragraph">Setting details panel.</p> },
                      { id: "diamond", label: "Diamond", panel: <p className="type-paragraph">Diamond details panel.</p> },
                      { id: "care", label: "Care", panel: <p className="type-paragraph">Care panel.</p> },
                      { id: "reviews", label: "Reviews", disabled: true },
                    ]}
                  />
                </Item>
              ))}
            </div>
          </Group>
          <Group title="Tabs - Overlay" overlay surface="leather">
            <div className="flex flex-col gap-space-6">
              {(["md", "sm", "xs"] as const).map((size) => (
                <Item overlay key={size} label={`Tabs - Overlay, Size=${size.toUpperCase()}`}>
                  <Tabs
                    label={`Collections, ${size}`}
                    size={size}
                    overlay
                    items={["Rings", "Bands", "Earrings", "Necklaces"].map((label) => ({ id: label, label }))}
                  />
                </Item>
              ))}
            </div>
          </Group>
        </Section>

        <Section id="pagination" title="Pagination">
          <Group title="Pagination Number">
            <Row>
              {(["md", "sm"] as const).flatMap((size) =>
                [
                  { name: "Default" },
                  { name: "Hover", preview: "hover" as const },
                  { name: "Active", active: true },
                ].map((state) => (
                  <Item key={`${size}-${state.name}`} label={`Size=${size.toUpperCase()}, State=${state.name}`}>
                    <nav aria-label={`Pagination preview ${size} ${state.name}`}>
                      <PaginationNumber page={1} size={size} active={state.active} previewState={state.preview} />
                    </nav>
                  </Item>
                )),
              )}
            </Row>
          </Group>
          <Group title="Working pagination (gap between numbers added)">
            <Row>
              <Item label="Size=MD"><PaginationDemo /></Item>
              <Item label="Size=SM"><PaginationDemo size="sm" /></Item>
            </Row>
          </Group>
          <Group title="Pagination Dots">
            <p className="type-body-sm-regular mb-space-4 max-w-[40rem]">
              Rule: any carousel using dots must also offer previous and next buttons or swipe. The dots alone are too small and close
              together to meet the WCAG 2.2 target size.
            </p>
            <Item label="Type=Dots, Color=Default"><PaginationDotsDemo /></Item>
          </Group>
          <Group title="Pagination Dots - Overlay" overlay>
            <Item overlay label="Type=Dots, Color=Default"><PaginationDotsDemo overlay /></Item>
          </Group>
        </Section>

        <Section id="step-indicator" title="Step Indicator">
          {(["desktop", "mobile"] as const).map((breakpoint) => (
            <Group key={breakpoint} title={`Step Indicator, Breakpoint=${breakpoint === "desktop" ? "Desktop" : "Mobile"}`}>
              <div className={breakpoint === "desktop" ? "grid grid-cols-1 gap-space-5 desktop:grid-cols-2" : "flex flex-wrap gap-space-5"}>
                {[
                  { state: "Inactive", complete: false, unavailable: false },
                  { state: "Active", complete: false, unavailable: false },
                  { state: "Inactive", complete: true, unavailable: false },
                  { state: "Active", complete: true, unavailable: false },
                  { state: "Inactive", complete: true, unavailable: true },
                  { state: "Active", complete: true, unavailable: true },
                ].map((variant) => (
                  <Item
                    key={`${variant.state}-${variant.complete}-${variant.unavailable}`}
                    label={`State=${variant.state}, Complete=${variant.complete ? "True" : "False"}, Unavailable=${variant.unavailable ? "True" : "False"}`}
                  >
                    <div className={breakpoint === "desktop" ? "max-w-[30rem]" : "w-[14.25rem]"}>
                      <StepIndicator
                        breakpoint={breakpoint}
                        step={1}
                        verb="Select"
                        noun="Setting"
                        active={variant.state === "Active"}
                        complete={variant.complete}
                        unavailable={variant.unavailable}
                        selectedName="Freesia 2mm Solitaire"
                        price="$720"
                        image={<span className="block size-full bg-secondary-peach" />}
                        actions={
                          variant.unavailable
                            ? [<StepActionLink key="new" href="#step-indicator">Select New Stone</StepActionLink>]
                            : [
                                <StepActionLink key="edit" href="#step-indicator">Edit</StepActionLink>,
                                <StepActionLink key="remove" href="#step-indicator">Remove</StepActionLink>,
                              ]
                        }
                      />
                    </div>
                  </Item>
                ))}
              </div>
            </Group>
          ))}
          <Group title="Step list (responsive)">
            <StepList label="Ring builder steps" className="flex-col gap-space-2 desktop:flex-row desktop:gap-0">
              <StepIndicator step={1} verb="Select" noun="Setting" complete selectedName="Freesia 2mm Solitaire" price="$720" actions={[<StepActionLink key="e" href="#step-indicator">Edit</StepActionLink>]} />
              <StepIndicator step={2} verb="Select" noun="Diamond" active />
              <StepIndicator step={3} verb="Review" noun="Ring" />
            </StepList>
          </Group>
        </Section>

        <Section id="status" title="Status">
          <Group title="Status Marker">
            <Row>
              {(["md", "sm"] as const).flatMap((size) =>
                [
                  { name: "Completed=False, Delivered=Default" },
                  { name: "Completed=True, Delivered=Default", completed: true },
                  { name: "Completed=True, Delivered=True", completed: true, delivered: true },
                ].map((state) => (
                  <Item key={`${size}-${state.name}`} label={`${state.name}, Size=${size.toUpperCase()}`}>
                    <StatusMarker size={size} completed={state.completed} delivered={state.delivered}>Preparation</StatusMarker>
                  </Item>
                )),
              )}
            </Row>
          </Group>
        </Section>

        <Section id="scrollbar" title="Scrollbar">
          <Group title="Scrollbar">
            <Row wide>
              <Item label="Theme=Light (start)"><Scrollbar progress={0} /></Item>
              <Item label="Theme=Light (middle)"><Scrollbar progress={0.5} /></Item>
            </Row>
          </Group>
          <Group title="Scrollbar - Overlay" overlay surface="leather">
            <Row wide>
              <Item overlay label="Theme=Light (start)"><Scrollbar progress={0} overlay /></Item>
              <Item overlay label="Theme=Light (end)"><Scrollbar progress={1} overlay /></Item>
            </Row>
          </Group>
          <Group title="Working demo: scroll sideways, or focus and use the arrow keys">
            <ScrollArea label="Ring styles" className="max-w-[24.375rem]">
              <div className="flex gap-space-2">
                {["Solitaire", "Halo", "Pave", "Three Stone", "Vintage", "Bezel", "Cathedral"].map((name) => (
                  <span key={name} className="type-ui-sm-medium flex h-space-18 w-space-19 shrink-0 items-center justify-center bg-secondary-ivory">
                    {name}
                  </span>
                ))}
              </div>
            </ScrollArea>
          </Group>
        </Section>

        <Section id="cards" title="Cards">
          {(["desktop", "mobile"] as const).map((bp) => (
            <Group key={bp} title={`Breakpoint=${bp === "desktop" ? "Desktop" : "Mobile"}`}>
              <div role="region" aria-label={`Cards preview, ${bp}`} tabIndex={0} className="relative overflow-x-auto pb-space-2">
              <div data-breakpoint={bp} className="flex w-max items-start gap-space-8">
                <Item label="Category Card - Quick">
                  <div className={bp === "desktop" ? "w-[18rem]" : "w-[16.25rem]"}>
                    <CategoryCard label="engagement rings" href="#cards" image={{ desktop: "cat-engagement-rings-d", mobile: "cat-engagement-rings-m", alt: "" }} sizes={{ desktop: "288px", mobile: "260px" }} />
                  </div>
                </Item>
                <Item label="DYO Card">
                  <div className="w-[25rem] max-w-full">
                    <DyoCard icon="setting-empty" title="Setting" body="Celebrate your love with our stunning selection of engagement ring designs." cta={{ label: "Start with a setting", href: "#cards" }} />
                  </div>
                </Item>
                <Item label="Feature Card (no body, and with body)">
                  <div className="flex gap-space-4">
                    <FeatureCard title="Gemstones" ctaLabel="Shop Now" href="#cards" image={{ desktop: "feature-gemstones-d", mobile: "feature-gemstones-m", alt: "" }} sizes={{ desktop: "400px", mobile: "171px" }} className={bp === "desktop" ? "aspect-[4/5] w-[25rem]" : "aspect-[4/5] w-[10.6875rem]"} />
                    <FeatureCard title="Amara & James" body="A pear-cut diamond on a slim band, chosen together." ctaLabel="Read Story" href="#cards" image={{ desktop: "story-face-d", mobile: "story-face-m", alt: "" }} sizes={{ desktop: "400px", mobile: "288px" }} className={bp === "desktop" ? "aspect-[4/5] w-[25rem]" : "aspect-[4/5] w-[18rem]"} />
                  </div>
                </Item>
                <Item label="Product Card (product list). Desktop hover or focus shows the shell, image dots, Info, Add to Bag and installments">
                  <ProductCardDemo product={productCardSample} />
                </Item>
                <Item label="Product Card - Summary">
                  <div className={bp === "desktop" ? "w-[18.375rem]" : "w-[18.0625rem]"}>
                    <ProductCardSummary name="Halo Ring" body="A circle of diamonds frames the stone." priceLabel="starting at $999" href="#cards" image={{ desktop: "ring-rose-gold-d", mobile: "ring-rose-gold-m", alt: "" }} sizes={{ desktop: "294px", mobile: "289px" }} />
                  </div>
                </Item>
                <Item label="Post Card, Size=LG">
                  <div className={bp === "desktop" ? "w-[25rem]" : "w-[18rem]"}>
                    <PostCard title="Stacking Rings: Mixing Metals and Shapes" excerpt="Simple rules for pairing bands with your engagement ring." topic="Style" date="2026-08-05" readTime="3 Min Read" href="#cards" image={{ desktop: "story-hand-post", alt: "" }} sizes={{ desktop: "400px", mobile: "288px" }} />
                  </div>
                </Item>
                <Item label="Resource Card, Size=LG">
                  <div className={bp === "desktop" ? "w-[44.875rem]" : "w-[21.875rem]"}>
                    <ResourceCardLarge topic="Diamonds" title="The 4Cs of Diamonds" body="Cut, color, clarity and carat weight decide how a diamond looks and what it costs." href="#cards" ctaLabel="Read More" image={{ desktop: "story-arms-wide", alt: "" }} sizes={{ desktop: "702px", mobile: "350px" }} />
                  </div>
                </Item>
                <Item label="Resource Card, Size=SM">
                  <div className={bp === "desktop" ? "w-[31.625rem]" : "w-[21.875rem]"}>
                    <ResourceCardSmall topic="Rings" title="Finding the right ring size at home" href="#cards" image={{ desktop: "story-hand-sq", alt: "" }} sizes={{ desktop: "128px", mobile: "104px" }} />
                  </div>
                </Item>
                <Item label="Review Card">
                  <div className={bp === "desktop" ? "w-[25rem] bg-primary-leather p-space-4" : "w-[18rem] bg-primary-leather p-space-4"}>
                    <ReviewCard name="Maya R." rating={5} date="2026-10-12" body="We designed my ring from the setting up. The finished ring is exactly what I pictured." />
                  </div>
                </Item>
              </div>
              </div>
            </Group>
          ))}
        </Section>

        <Section id="site-chrome" title="Header and footer">
          <p className="type-body-sm-regular max-w-[40rem]">
            The live announcement bar, header and footer are on every page. These previews force each Figma breakpoint and state, and
            scroll sideways when the window is narrower than the design.
          </p>
          <Group title="Nav Item and Nav Item - Overlay">
            <Row>
              {[
                { name: "Default" },
                { name: "Hover", state: "hover" as const },
                { name: "Active", state: "current" as const },
              ].map((state) => (
                <Item key={state.name} label={`Nav Item, State=${state.name}`}>
                  <nav aria-label={`Nav Item preview ${state.name}`} className="bg-secondary-ivory p-space-2">
                    <NavItem href="#site-chrome" previewState={state.state}>Nav Item</NavItem>
                  </nav>
                </Item>
              ))}
            </Row>
          </Group>
          <Group title="Nav Item - Overlay" overlay surface="leather">
            <Row>
              {[
                { name: "Default" },
                { name: "Hover", state: "hover" as const },
                { name: "Active", state: "current" as const },
              ].map((state) => (
                <Item overlay key={state.name} label={`Nav Item - Overlay, State=${state.name}`}>
                  <nav aria-label={`Overlay nav item preview ${state.name}`}>
                    <NavItem href="#site-chrome" overlay previewState={state.state}>Nav Item</NavItem>
                  </nav>
                </Item>
              ))}
            </Row>
          </Group>
          <Group title="Top Bar (announcement bar)">
            <div className="flex flex-col gap-space-6">
              {(["desktop", "mobile"] as const).flatMap((breakpoint) =>
                (["messages", "countdown"] as const).map((mode) => (
                  <Item
                    key={`${breakpoint}-${mode}`}
                    label={`Variant=${mode === "messages" ? "Default" : "Timer"}, Breakpoint=${breakpoint === "desktop" ? "Desktop" : "Mobile"}`}
                  >
                    <div role="region" aria-label={`Top bar preview, ${mode}, ${breakpoint}`} tabIndex={0} className="overflow-x-auto">
                      <div className={breakpoint === "desktop" ? "w-[90rem]" : "w-[24.375rem]"}>
                        <AnnouncementBar
                          breakpoint={breakpoint}
                          mode={mode}
                          label={`Announcements preview, ${mode}, ${breakpoint}`}
                        />
                      </div>
                    </div>
                  </Item>
                )),
              )}
            </div>
          </Group>
          <Group title="Header">
            <div className="flex flex-col gap-space-6">
              {[
                { name: "Breakpoint=Desktop, two-row (default)", breakpoint: "desktop" as const, layout: "two-row" as const },
                { name: "Breakpoint=Desktop, one-row (when to use it is not defined in Figma)", breakpoint: "desktop" as const, layout: "one-row" as const },
                { name: "Breakpoint=Mobile, Menu Open=False", breakpoint: "mobile" as const, layout: "two-row" as const },
                { name: "Breakpoint=Mobile, Menu Open=True (Nav / Main)", breakpoint: "mobile" as const, layout: "two-row" as const, open: true },
                {
                  name: "Breakpoint=Mobile, Menu Open=True (Nav / Engagement Rings)",
                  breakpoint: "mobile" as const,
                  layout: "two-row" as const,
                  open: true,
                  category: "engagement-rings",
                },
              ].map((variant) => (
                <Item key={variant.name} label={variant.name}>
                  <div role="region" aria-label={`Header preview, ${variant.name}`} tabIndex={0} className="overflow-x-auto">
                    <div className={variant.breakpoint === "desktop" ? "w-[90rem]" : "w-[24.375rem]"}>
                      <Header
                        breakpoint={variant.breakpoint}
                        layout={variant.layout}
                        defaultMenuOpen={variant.open}
                        defaultMenuCategory={"category" in variant ? variant.category : undefined}
                        labelSuffix={` preview, ${variant.name}`}
                      />
                    </div>
                  </div>
                </Item>
              ))}
            </div>
          </Group>
          <Group title="Mega menus (desktop panels, shown open)">
            <div className="flex flex-col gap-space-6">
              {siteHeader.primary.map((link) => (
                <Item key={link._key} label={`Mega Menu / ${link.label}`}>
                  <div role="region" aria-label={`Mega menu preview, ${link.label}`} tabIndex={0} className="overflow-x-auto">
                    <div className="w-[90rem]" data-breakpoint="desktop">
                      <MegaMenuPanel menu={link.menu} label={`${link.label} preview`} inline />
                    </div>
                  </div>
                </Item>
              ))}
              <Item label="Mega Menu / Search">
                <div role="region" aria-label="Search panel preview" tabIndex={0} className="overflow-x-auto">
                  <div className="w-[90rem]" data-breakpoint="desktop">
                    <SearchPanel content={siteHeader.searchPanel} inline />
                  </div>
                </div>
              </Item>
            </div>
          </Group>
          <Group title="Footer newsletter states" overlay>
            <div className="grid grid-cols-1 gap-space-8 desktop:grid-cols-2">
              <Item overlay label="Footer Signup - Error">
                <div className="bg-primary-blue p-space-5"><Newsletter previewState="error" /></div>
              </Item>
              <Item overlay label="Footer Signup - Confirmation">
                <div className="bg-primary-blue p-space-5"><Newsletter previewState="success" /></div>
              </Item>
            </div>
          </Group>
        </Section>

        <Section id="bag" title="Bag">
          <BagDemos />
        </Section>

        <Section id="account" title="Account">
          <AccountDemos />
        </Section>

        <Section id="ring-builder" title="Ring builder">
          <BuilderDemos setting={builderSetting} round={roundStone} drawn={drawnStone} otherLab={otherLabStone} />
          <h3 className="type-heading-sm mt-space-15 mb-space-6 text-primary-leather">Step 3: Complete (/design-your-own/complete/)</h3>
          <CompleteDemos setting={builderSetting} stone={roundStone} />
        </Section>

        <Section id="earrings-builder" title="Earrings builder">
          <EarringsDemos setting={earringSetting} pair={earringPair} />
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
            <li>Tab Item hover: Figma uses black-alpha-50, 3.42:1 on secondary/skin, which fails AA. Built with black-alpha-60, 4.70:1.</li>
            <li>Pagination Number hover text: Figma hard-codes #1f2937, which is not a token. Built with base/black #141829, 14.29:1 on peach.</li>
            <li>Nav Item hover: Figma uses black-alpha-50, 3.34:1 on ivory, which fails AA. Built with black-alpha-60, 4.56:1.</li>
            <li>Top Bar countdown units (D, H, M, S): Figma uses white-alpha-50, 4.31:1 on leather. Built with white-alpha-60, 5.48:1.</li>
            <li>
              Footer Privacy Policy and Contact Us links: Figma marks them only by color, ivory against gold text at 2.04:1, below the 3:1
              needed to tell links apart. Built with an underline.
            </li>
            <li>
              Modal backdrop: black-alpha-50, not defined in Figma. Confirm against the first approved page frame that shows a modal.
            </li>
            <li>Nav Item - Child hover: Figma uses black-alpha-50, 3.36:1 on ivory. Built with black-alpha-60, 4.58:1, as for Nav Item.</li>
            <li>Post Card topic and date: Figma uses black-alpha-50, 3.36:1 on ivory. Built with black-alpha-60, 4.58:1.</li>
            <li>Mobile menu search placeholder: Figma uses black-alpha-50, 3.36:1. Built with black-alpha-60, 4.58:1.</li>
            <li>
              Footer demo notice: a deliberate addition, not in Figma. One line under the copyright, in the same style: &ldquo;Portfolio
              build by Rob Coven. Not the live Sky Jewelry store; products, prices and reviews are sample content.&rdquo;
            </li>
            <li>Review Card date and Post Card meta (Home): Figma uses black-alpha-50, 3.36:1 on skin. Built with black-alpha-60, 4.58:1.</li>
            <li>
              Search panel focus: Figma shows no focus state. A 1px leather underline appears under the field while it has focus.
            </li>
            <li>
              Product list sub-type (the menu&rsquo;s ?type=, e.g. Diamond Rings): Figma has no control for it. On mobile it is one of the
              chips; on desktop it shows as a single removable chip under the filter bar.
            </li>
            <li>
              Filters sheet: choosing another category hides the groups that belong to the current page and adds one line saying metal and
              diamond type carry over when you press Apply.
            </li>
            <li>
              Question Mark icon: Figma draws the circle in gold and the dot in leather. Built in leather only: gold on skin is 2.1:1, below
              the 3:1 an icon needs.
            </li>
            <li>
              Metal badges: Figma&rsquo;s SVG export drops the Glow layer&rsquo;s overlay blend, which turns the badge dark. The blend is
              added back, as on the card Swatch.
            </li>
            <li>
              Bag panel (desktop): Figma draws the overlay on its own. Built as a 390px dialog at the top right of the window, over the dimmed
              page like the other overlays, so it shows wherever the shopper adds an item.
            </li>
            <li>Bag screen (mobile): the frame ends just above the Shop All bar. Built with the bar fixed to the bottom of the screen.</li>
            <li>Empty bag: not drawn. Built from the product list&rsquo;s empty state: a one-line message and Back to Shopping.</li>
            <li>
              Bag page Secure Checkout: Figma draws no checkout page. It opens Modal - Default with a short notice that this is a portfolio
              demo and no order is placed. No payment fields, and nothing goes to Shopify&rsquo;s checkout.
            </li>
            <li>
              Affirm, Klarna and Jeweler&rsquo;s Mutual logos (Modal - Credit, Modal - JM Info, the protection plans table): shown as their
              names in heading type, as with the GIA logo.
            </li>
            <li>Bag &ldquo;Ships in 2-3 weeks&rdquo;: built from the pieces&rsquo; own shipping times (the longest in the bag), as on the product page.</li>
            <li>Bag Special Instructions and This is a Gift: kept in the browser only, since checkout is simulated.</li>
            <li>
              Bag lines: Figma draws builder rings (a setting row and a stone row, each with Edit). Fine Jewelry lines use Figma&rsquo;s tennis
              bracelet row (Metal, Carat, Size), with short names as in the panel. An unavailable piece reads &ldquo;This item is no longer
              available.&rdquo; (Figma: &ldquo;This stone&hellip;&rdquo;).
            </li>
            <li>Product page Secure Checkout: adds the piece and goes to the bag page (not drawn; inferred).</li>
            <li>Bag panel Secure Checkout (Shop All bar): leads to the bag page, where checkout starts (not drawn; inferred).</li>
            <li>
              Bag care plan: Figma draws no way to remove an added plan. When the picker is reopened from Change (desktop) or Edit (mobile),
              &ldquo;No Thanks&rdquo; removes the plan from that line (inferred).
            </li>
            <li>
              360° marker and the &ldquo;360° View / Images / Video&rdquo; tab rows: hidden until 360 image sequences exist (one switch,
              SHOW_360 in src/lib/features.ts, set to off; the viewer is kept and reads images named
              &ldquo;&hellip;-spin-01&rdquo;, &ldquo;-spin-02&rdquo;&hellip;). Figma draws them on Product Detail (the 360° tile on desktop, the
              tabs on mobile); on the ring builder&rsquo;s Step 1 and Step 2 hover cards, Modal / Setting Selection and Modal / Stone
              Selection (marker and tabs), the setting page (marker on a setting photo; mobile marker and tabs), the stone page (marker)
              and Step 3 (marker on the setting&rsquo;s photo; mobile marker and tabs); and on the earrings builder&rsquo;s setting page
              (marker on the diamond tile; mobile marker and tabs), pair page (marker on each diamond) and Step 3 (marker on the studs
              and both diamonds; mobile marker and tabs). The earrings cards and sheets draw neither. Without the tab rows the mobile
              galleries are 390px tall, not 430 (everything below sits 40px higher), the stone hover card is 525px tall against 572 and
              the stone sheet 602 against 646.
            </li>
            <li>
              Product gallery stone photo: Figma&rsquo;s loose round diamond photo stands in for &ldquo;the stone&rdquo; on every piece with a
              round diamond (desktop tile 2, mobile thumbnail). It is a sample photo, not the actual stone.
            </li>
            <li>Mobile Metal picker: Figma pairs it with a Stone picker; the catalogue has no stone option, so Metal shows alone at half width.</li>
            <li>Flagged: the mobile product page hides the &ldquo;Pendant Details&rdquo; accordion, as Figma; desktop shows it. Kept hidden.</li>
            <li>Mobile GIA logo row on the Certification card: left out (a third-party logo, and it reads &ldquo;Natural Diamond&rdquo; on lab-grown pieces).</li>
            <li>Product page &ldquo;200 Reviews&rdquo; on desktop: Figma uses white-alpha-50, below AA on leather. Reuses the Home reviews section (skin, as Figma mobile).</li>
            <li>
              Landing &ldquo;Start a live chat&rdquo; (Consult module) and the Fine Jewelry &ldquo;Send us a text&rdquo; card: nothing to connect to,
              so they are inert (plain text styled as the button). The product page&rsquo;s own &ldquo;Send us a text&rdquo; is inert in the
              same way.
            </li>
            <li>Landing best-seller cards keep the product card&rsquo;s Add to Bag; Figma&rsquo;s hover demo says &ldquo;Complete your ring&rdquo; and shows a &ldquo;with stone&rdquo; price, which belong to the ring builder.</li>
            <li>Gemstones promo band: mobile only, as Figma (the desktop copy is hidden). Wedding Bands Customer Stories: desktop only. Fine Jewelry Reviews: mobile only.</li>
            <li>
              All Fine Jewelry (/fine-jewelry/shop/): the product list with every Fine Jewelry product, no category tab selected and
              all filters. The unselected-tab state is not drawn in Figma.
            </li>
            <li>Filters sheet category tiles share their row (80px at 390, as Figma; narrower on smaller phones instead of overflowing).</li>
            <li>
              Top Bar countdown width: the label and timer group is about 9px wider than Figma (259 vs 250px on desktop, 243 vs 234px on
              mobile, still centred). The digits use fixed-width (tabular) figures so the group does not shift as the seconds tick, and the
              browser adds the 10% letter-spacing after the last letter of each part. The gaps match Figma.
            </li>
            <li>
              Top Bar countdown date: a mock sale that ends 6 days 8 hours 23 minutes 48 seconds after the build (Figma&rsquo;s
              &ldquo;06 D : 08 H : 23 M : 48 S&rdquo;). If the site is not rebuilt before then, the sale restarts every 7 days, so the timer
              never shows zero.
            </li>
            <li>
              Icon line width: Figma draws some icon lines at its default 1px and keeps them 1px at every size (Lifetime
              Warranty, 30 Days Free Return and Certificate on the product page, parts of Earrings and Diamond Experts). Built
              at 0.99px, also at every size: Chrome draws an exactly-1px curved line as a dotted line on standard-density
              screens; 0.99px renders solid and looks the same.
            </li>
            <li>
              Account sign-in: Figma draws no sign-in screen. The header&rsquo;s Account link goes to /account/, which shows a mock signed-in
              customer. There are no sign-in, sign-up or password fields (not drawn).
            </li>
            <li>
              Account labels (Name, Email Address, Shipment Method, Method of Payment, Shipping and Billing Address): Figma uses black-alpha-50,
              3.42:1 on secondary/skin, which fails AA. Built with black-alpha-60, 4.70:1.
            </li>
            <li>
              Add Address: a saved address is kept in this browser only. The form has no name field, so the card shows the customer&rsquo;s
              name, as Figma&rsquo;s cards do; Company and Phone are saved but not shown, as the cards don&rsquo;t draw them.
            </li>
            <li>
              Order pieces: Figma draws builder rings (&ldquo;Product Title / Config 1, Config 2&rdquo;; &ldquo;Setting Name&rdquo; and
              &ldquo;Diamond Type&rdquo; with Metal, Band, Ring Size). Built for the catalogue&rsquo;s Fine Jewelry: the short product name,
              config &ldquo;metal, length, carat&rdquo;, and Metal / Carat / Size rows as on the bag page. Download Certificate shows where
              the product page shows View Certificate.
            </li>
            <li>Order Price: the Discount row shows only when the order has one (Figma&rsquo;s sample has one; inferred).</li>
            <li>
              Order Details: the Order Price card sits beside the pieces when the page column is at least 800px wide (the 1440 frame, 822px)
              and below them when narrower (the 1280 frame, 716px). The switch point between the two drawn widths is inferred.
            </li>
            <li>
              Add Address: every field Figma marks with an asterisk is required (Address 1, City, State, Zip / Postal Code, Country, Phone
              Number), with the wording of the drawn &ldquo;City is required&rdquo;, plus the drawn phone check. The Errors frames only show
              City and Phone, so the other required fields are inferred.
            </li>
            <li>
              Account page column at 1280: 733px, where the 1280 frame draws 716. The site&rsquo;s side margin is fluid (84px at 1280); the
              frame keeps 1440&rsquo;s 96px.
            </li>
            <li>
              Order cards grow when a product name takes two lines (Figma&rsquo;s sample &ldquo;Product Title&rdquo; is one line), e.g. 523px
              against the frame&rsquo;s 504.5 on desktop.
            </li>
            <li>Sticky header: not drawn in Figma; added at Rob&rsquo;s request on Nov 20. Desktop uses the Header page&rsquo;s one-row bar.</li>
            <li>Ring builder catalogue: Figma&rsquo;s frames repeat one ring and one diamond on every card. Built with six settings, each around a ring photo Figma has, and 132 sample stones; the names, grades, measurements and prices are sample data.</li>
            <li>
              Ring builder stone photos: Figma has loose-stone photos for five diamond shapes (round, cushion, emerald, radiant,
              marquise) and five coloured stones. A stone without one shows Figma&rsquo;s line drawing of its shape instead of a photo
              of a different stone (inferred).
            </li>
            <li>
              Ring builder &ldquo;Set with&rdquo;: every sample setting can be made for every centre stone shape, so Set with sets the
              shape the ring is built for and does not shorten the list. Before a shape is chosen the control reads
              &ldquo;Shape&rdquo; (Figma only draws &ldquo;Set with Round&rdquo;). Its open panel is not drawn; it reuses the Price
              panel&rsquo;s look with the shape tiles (inferred).
            </li>
            <li>
              Ring builder price notes: &ldquo;with stone&rdquo; is the setting plus the lowest-priced stone of the chosen shape (of any
              shape when none is chosen); &ldquo;with setting&rdquo; is the stone plus the chosen setting (inferred).
            </li>
            <li>
              Setting page gallery: Figma&rsquo;s mirrored second setting photo and its video tile are left out, as are the dots and arrow
              on the first worn photo and the carat tabs on the second (there is one photo of each). That leaves three tiles, laid out by Product
              Detail&rsquo;s rule: the first spans the row.
            </li>
            <li>
              Setting page at 1140: the site&rsquo;s margin is fluid (74px where the 1140 frame keeps 64), so the photo column is 501px
              against 512 and the text column 450 against 460.
            </li>
            <li>
              Setting page info cards: Width, Approx. TCW, Accent Gems and Profile show sample values; settings without accent stones
              leave out the TCW and Accent Gems cards. The Profile note states the height only (Figma: &ldquo;Only stacks with a
              chevron/curved band&rdquo;), and the Metal note is Product Detail&rsquo;s (Figma: Latin filler).
            </li>
            <li>
              Ring builder promo cards: Figma&rsquo;s &ldquo;Promotional Headline&rdquo; and Latin filler are replaced with copy that
              repeats what the site already says. View More comes after 24 settings on desktop and 15 on mobile, as each frame draws.
            </li>
            <li>Mobile setting page: the Style tile shows the setting&rsquo;s style and is not a picker.</li>
            <li>Step Indicator: the current step&rsquo;s name is in the italic heading style, as every builder frame draws it (the Design System variant uses the upright style).</li>
            <li>Ring builder ships line: &ldquo;Ships in N days&rdquo; from the piece&rsquo;s own lead time (Figma: &ldquo;Ships in 2-3 weeks&rdquo;), as on the product page.</li>
            <li>Stone page specs tile: Figma&rsquo;s numbers are placeholders. Built with the stone&rsquo;s own length and width in mm on the top view, and its table and depth percentages on the side view. Figma draws a round stone only: the other shapes show their line drawing with length and width.</li>
            <li>Stone page tiles without a photo sit on the certificate tile&rsquo;s fill (#f2f0ec), since the product gradient only shows behind a photo.</li>
            <li>Stone page info cards: the Cut card&rsquo;s note is the grade&rsquo;s short description (Figma: &ldquo;Ratio: 1.46&rdquo;); the Carat note is Product Detail&rsquo;s (Figma: Latin filler); Color I reads &ldquo;Nearly colorless&rdquo; (Figma: &ldquo;Slightly tinted&rdquo;). The Clarity card is as tall as its note needs (142px against 158).</li>
            <li>Stone page and Step 3 labs: Figma draws the GIA seal on the certificate tile and the Certification card. Every lab (GIA, AGS, IGI) shows the certificate icon and the lab&rsquo;s name instead (&ldquo;GIA Natural Diamond&rdquo;), as third-party logos are shown as names elsewhere on the site (Rob&rsquo;s decision, Nov 20).</li>
            <li>Gemstone stone pages (not drawn): &ldquo;Your Stone Info&rdquo; and &ldquo;Stone Specs&rdquo;, the colour and gem type on the Color card, no grade scales, no Qualities section and no hand photo.</li>
            <li>Grade descriptions: Figma writes one grade per scale (Color G, Clarity VVS2, Cut Excellent). The other grades use replacement copy that states the grade&rsquo;s standard definition.</li>
            <li>Stone list slider bounds come from the stones in the tab, as on the product list (Figma: 0.50 to 6.00 carats and $200 to $5,000,000).</li>
            <li>Stone list, desktop Advanced Filters for diamonds: Figma draws the open row for gemstones only (Treatment, L/W Ratio, Certificate dropdowns). Diamonds are built on that pattern with Polish, Symmetry, Fluorescence, Table, Depth and L/W Ratio, the filters the mobile sheet lists (inferred). The count badge shows the number of active advanced filters, and Clear Filters shows when a filter is active.</li>
            <li>Stone list question marks are leather (Figma: gold) to reach 3:1 against the page. Desktop number inputs have Product List&rsquo;s 24px stepper column (Figma: 20px), and the sheet&rsquo;s shape tiles are 80px squares (Figma&rsquo;s hug to about 72px tall).</li>
            <li>Stone cards: the card title is the shape, as Figma&rsquo;s &ldquo;Round&rdquo;; the stone&rsquo;s full name is its accessible name.</li>
            <li>Cut / Color / Clarity modal: choosing a grade changes the explanation only, not the filters. The Color and Clarity drawings reuse Product Detail&rsquo;s (the modal&rsquo;s Clarity drawing differs slightly). No close button is drawn: Escape and the backdrop close it.</li>
            <li>Ring builder Step 1 lists only settings tagged &ldquo;setting&rdquo;: the six new ones. The store&rsquo;s four engagement rings (Channel Set, Halo, Side-Stone, Eternity) are left out of the list and its filters, because their photos are the vine ring&rsquo;s. They keep their setting pages, which Home&rsquo;s best sellers link to.</li>
            <li>Ring builder style tiles: a style with no settings is left out, on desktop and in the mobile sheet. The Design System&rsquo;s Radio Button (Radio 588:1170) draws Inactive, Hover, Pressed and Active, and no disabled state. Desktop shows Solitaire, Pave, Side Stone, Halo and Natural of Figma&rsquo;s nine; the sheet shows Solitaire, Pave, Side Stone and Halo of its eight (it draws no Natural).</li>
            <li>Gemstone Type: a type with no stones in the tab is not offered (Moissanite is lab-grown only, so the Natural tab doesn&rsquo;t list it).</li>
            <li>Ring builder Step 3, ring size converter: Inches (drawn) and Centimetres. The US formula (inside diameter 11.63 + 0.8128 &times; size mm) gives 2 inches as size 5.5; Figma&rsquo;s example says 6. Built with the formula. Lengths outside sizes 3 to 13.5, or an empty field, show the Design System&rsquo;s input error message under the row (not drawn).</li>
            <li>Mobile galleries of the setting page (3587:125842), the stone page (3587:125937) and Step 3 (6579:208207): the thumbnail switches between the ring and its worn photos (setting page) or the ring and its stone (Step 3).</li>
            <li>Step 3 desktop gallery, stone tile: Figma&rsquo;s Pagination Dots (6579:194568) are left out. Each stone has one photo, so there is nothing to page through; they come back with more stone photos. (The product page&rsquo;s dots on one tile of its static grid are a corrected oversight; here they would page the stone&rsquo;s own photos.)</li>
            <li>Step 3 desktop gallery, fourth tile (6579:194577): Figma draws a second photo of the ring, with its Badge hidden. Built with the setting&rsquo;s second photo and no badge. Only Classic Solitaire in yellow gold has one; every other setting and metal has one photo, so its tile keeps the setting page&rsquo;s worn photo with &ldquo;Shown with 2.50 ct&rdquo; (see Open questions).</li>
            <li>Step 3 names, each place in its own frame&rsquo;s wording, from the setting&rsquo;s short name and the stone&rsquo;s title: desktop &ldquo;Vine 1.01 Carat H VVS2 Round Natural Diamond Engagement Ring&rdquo;, mobile &ldquo;The Vine with a &hellip;&rdquo;, the bag page &ldquo;Vine Ring with a &hellip;&rdquo; (without Figma&rsquo;s cut abbreviation &ldquo;VG&rdquo;: the stone&rsquo;s title has none) and the bag panel &ldquo;Vine Ring&rdquo;. The step bar&rsquo;s stone reads &ldquo;Round 1.01 Carat&rdquo; with its price once (Figma: &ldquo;Round 0.50 Carat - $1,040&rdquo; beside the price).</li>
            <li>Step 3 Total Price is the setting plus the stone; the ships line is the longer of the two lead times (&ldquo;Ships in 7 days&rdquo;; Figma: &ldquo;Ships in 2-3 weeks&rdquo;).</li>
            <li>Step 3 Ring Details: each breakpoint has its frame&rsquo;s tables (desktop Center Stone Details and Setting Details; mobile Details and Side Stones). Side Stones leaves out Shape and Origin (the catalogue has no data for them) and is left out for settings without accent stones. The mobile Your Setting Info shows Metal, Width and Approx. TCW only, as its frame draws them.</li>
            <li>Step 3 buttons: the disabled Secure Checkout and Add to Bag carry a screen-reader note, &ldquo;Choose a ring size to continue.&rdquo; Add to Bag opens the bag panel and Secure Checkout goes to the bag page (Figma&rsquo;s prototype sends both to the bag page). A stone already in the bag is not added again: the bag opens instead.</li>
            <li>Step 3, Modal - Ring Size and Modal - Drop a Hint: the close button is at full strength, as on the site&rsquo;s other modals (Figma draws it at 30%). Drop a Hint&rsquo;s &ldquo;(Optional)&rdquo; is black-alpha-60 (Figma: black-alpha-50), as for the Input placeholder above. Required fields and email format use the Add Address errors&rsquo; wording.</li>
            <li>A built ring in the bag: the setting row leaves out Figma&rsquo;s &ldquo;Band&rdquo; (the catalogue has no band value); part prices are whole dollars with a struck price only when the cart discounts the line (Figma draws &ldquo;$4,250 $3,750&rdquo;). The bag page has no quantity for a ring, as drawn; the panel draws Quanity Select on rings, so it shows 1 with plus disabled (a stone is one of a kind) and minus removing the ring.</li>
            <li>Step 3 is kept out of search results (noindex, follow): the page has no content without a ring in its URL.</li>
            <li>Footer contact details are mock values (123 Sample Ave, New York NY 10001; +1 (212) 555-0142; info@example.com): Figma shows the store&rsquo;s own address, phone and email, which a public demo shouldn&rsquo;t publish. The demo notice says contact details are sample content.</li>
            <li>Product page &ldquo;Drop a hint&rdquo; opens Step 3&rsquo;s Modal - Drop a Hint with the product&rsquo;s photo and name in the preview (inferred: Figma draws the modal for the ring builder). The optional Ring Size field shows for rings only.</li>
            <li>Ring builder Step 2 list leaves out stones Shopify reports as unavailable when the site is built. Their stone pages stay, and Step 3 still shows a stone sold since the build as unavailable.</li>
            <li>Earrings builder routes mirror the ring builder&rsquo;s under /design-your-own/earrings/ (setting/&lt;handle&gt;/, stone/, stone/&lt;handle&gt;/, complete/), with the earrings in the URL (setting, metal, shape, stone: the pair). Step 3 is noindex, follow, as the ring&rsquo;s.</li>
            <li>Earrings builder, Select These Earrings goes straight to Step 2 (diamonds). Figma&rsquo;s prototype opens &ldquo;Choose your Stones&rdquo; (3565:99781, Add Diamonds / Add Gemstones) first; no gemstone step is drawn for earrings and Add Gemstones links nowhere, so the modal is not built (Open questions).</li>
            <li>Earrings builder Step 1: Info and Customize on the hover card both open the setting&rsquo;s page, as the prototype links the card&rsquo;s button group. The mobile quick view reuses the ring builder&rsquo;s (Figma links the Fine Jewelry &ldquo;Product List / Modal&rdquo;, whose Carat Weight, Stone tile and Add to Bag don&rsquo;t apply to a setting): Metal tile, Info and Customize. Metal tiles and the Filters sheet offer only the metals the setting comes in (14K and 18K Yellow Gold).</li>
            <li>Earrings builder Step 2 runs the ring builder&rsquo;s stone list: pairs are filtered as one, with carat the pair&rsquo;s total weight, price the pair&rsquo;s price, and Table, Depth and L/W Ratio the average of the two stones. Pages hold 14 cards on desktop and 12 on mobile, the counts the frames draw (Figma&rsquo;s &ldquo;Showing 1-16 of 2000&rdquo; is placeholder text; the count is real). Pairs Shopify reports as unavailable at build time are left out.</li>
            <li>Earrings builder galleries: the model photo tile pages through the setting&rsquo;s three photos, worn first, with Figma&rsquo;s overlay dots and arrow (Figma draws five dots: there is one per photo). The third Setting Info tile shows the builder&rsquo;s round diamond photo. Mobile: the thumbnail switches to a diamond. Stones Info thumbnails switch each diamond&rsquo;s tile between its photo, its specs drawing and its certificate.</li>
            <li>Earrings builder Step 3: Secure Checkout and Add to Bag are enabled from the start (there is no size). Add to Bag sends the setting and the pair as two lines linked by an &ldquo;_earrings&rdquo; id in one cart call and opens the bag panel; Secure Checkout adds them and goes to the bag page. A pair already in the bag is not added again.</li>
            <li>Built earrings in the bag follow the built ring&rsquo;s rows (inferred: the bag frames draw only a ring): the heading is Step 3&rsquo;s name, the setting row shows Metal (no size), the pair row &ldquo;Natural Round Diamonds&rdquo; with both weights, Color, Cut and Clarity; one care plan row; they count as one item and Remove takes out both lines. The panel shows &ldquo;14K Yellow Gold / 1.02ct&rdquo; (the pair&rsquo;s total).</li>
            <li>Earrings builder, pair no longer available: the ring builder&rsquo;s drawn Stone Unavailable state, worded for a pair (&ldquo;These diamonds are no longer available.&rdquo;, &ldquo;Select New Diamonds&rdquo;, and the modal) (inferred: no earrings frame draws it). Step 3 reads the pair&rsquo;s availability from the Storefront API, the bag from the cart.</li>
            <li>Earrings builder Diamond Info, Carat card: &ldquo;The weight of this diamond.&rdquo; (the ring builder&rsquo;s says &ldquo;the center stone&rdquo;). Drop a Hint on the earrings pages has no Ring Size field and says &ldquo;Let someone know about the earrings you&rsquo;ve designed.&rdquo;</li>
            <li>Stone-first ring builder (Figma Stone First Builder 5440:36716 and Builder Stone First - Setting 8270:93583; mobile Section 1 6683:68101): the same pages in the other order, marked by first=stone in the URL. Step 1 is the stone list (/design-your-own/stone/), Step 2 the settings (/design-your-own/), Step 3 the complete ring; the step bar reads Select Diamond (Select Stone for gemstones), Select Setting, Complete Ring (mobile Stone, Setting, Ring). The menus&rsquo; stone links and Home&rsquo;s &ldquo;Start with a Stone&rdquo; start there.</li>
            <li>Stone first, Select Stone (Step 1 hover card and sheet) and Select Your Setting (the stone&rsquo;s page) go straight to Step 2. The prototype opens &ldquo;Choose your Setting&rdquo; first, which is not built (Open questions).</li>
            <li>Stone first, Step 2 lists only the settings that take the chosen stone&rsquo;s shape. No setting records its shapes, so every setting is taken to take all ten (as the setting page&rsquo;s Center Stone Shape picker offers): no stone is left without a setting. &ldquo;Set with&rdquo; is fixed to the stone&rsquo;s shape: its panel and the mobile sheet offer only that shape, and no shape chip shows. The third promo card keeps the setting-first card (Figma: &ldquo;Can&rsquo;t Decide? Take our quiz&rdquo;, Open questions).</li>
            <li>Stone first, the setting page: Figma draws every shape under Center Stone Shape and, on desktop, both tiles under &ldquo;Stone&rdquo; (Lab Grown Diamond, Natural Diamond). The chosen stone fixes both, so each shows only the stone&rsquo;s own value, and the mobile Stone tile only shows it, as Style does. The Stone picker is drawn for diamonds only: a gemstone has none. Meet With Our Consultant is left out, as both stone-first frames do; Choose This Setting goes to Step 3.</li>
            <li>Stone first, Step 3: desktop lists the stone&rsquo;s row before the setting&rsquo;s, as Builder Stone First - Complete does; mobile keeps the setting first, as its frame does. The stone-first Complete frame is a copy of the older Step 3 (no ring size or care plan); the page is the built Step 3 with only the order changed. Edit goes to the setting page and Remove to Step 2, keeping the stone; View goes to the stone&rsquo;s page and Remove to Step 1 with nothing chosen; Select New Stone goes to Step 1, keeping the setting.</li>
            <li>Built rings in the bag remember the flow they were built in (a hidden &ldquo;_first&rdquo; line attribute), so the bag&rsquo;s Edit and the ring&rsquo;s name return to Step 3 in that flow, and Select New Stone to that flow&rsquo;s stone list.</li>
            <li>Fine Jewelry menu and mobile Fine Jewelry screen: &ldquo;Design Your Own Earrings&rdquo; (to /design-your-own/earrings/) is added as the last row of the Earrings column. It is not in the approved menu; the wording is from the TO DOS menu rebuild (7970:215029), and the icon is the Assets &ldquo;Band&rdquo; that frame uses for &ldquo;Start with an Earring Setting&rdquo;. The desktop panel keeps its height (Rings has more rows).</li>
          </ul>
        </Section>

        <Section id="corrected-oversights" title="Corrected design oversights">
          <ul className="type-body-sm-regular flex max-w-[48rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>
              Stand-in menu icons. Figma shows setting and shape icons on band and jewelry links. Built with the matching Assets icons:
              Wedding Bands For Her, Classic, Diamond, Solid, Pave, Eternity, Anniversary and Prong (Figma: Channel Set, Hidden Halo,
              Solitaire, Pave, Halo, Channel Set, Nature) use Band Classic, Band Diamonds, Band Solid, Band Pave, Band Eternity, Band
              Anniversary and Band Prong. For Him, Classic and Diamond (Figma: Round, Gemstone) use Band Classic and Band Diamonds. Diamond
              Jewelry, Eternity Rings, Anniversary Rings, Diamond Studs, Diamond Pendants and Tennis Bracelets (Figma: Solitaire, Nature,
              Pave, Halo, Channel Set) use Eternity Ring, Band Anniversary, Diamond Stud, Pendant Solitaire and Tennis Bracelet. Start with
              a Pendant (Figma: Three Stone) uses Pendant Solitaire. Start with a Sapphire (Figma: Round) uses Gemstone. Gold Bracelets
              (Figma: Bracelets) uses Gold Bracelet.
            </li>
            <li>
              Bezel icon. Figma shows an archived &ldquo;Nature&rdquo; icon (a vine band) for Shop by Style, Bezel. Built with the Assets
              &ldquo;Bezel&rdquo; icon.
            </li>
            <li>
              Shape lists. Figma&rsquo;s desktop Loose Diamonds and Gemstones By Shape have Elongated Cushion and no Heart; the mobile
              frames have Heart and no Elongated Cushion, in another order. Built with the desktop list on both breakpoints.
            </li>
            <li>Spelling. Figma shows &ldquo;Shop All Engagment Rings&rdquo;. Built as &ldquo;Shop All Engagement Rings&rdquo;.</li>
            <li>
              Education placeholders. Figma shows Fine Jewelry product names under the Diamonds, Rings and Gemstones &amp; Fine Jewelry
              labels, and Latin blog titles with &ldquo;Topic&rdquo; and the same date. Built with education topics (The 4Cs of Diamonds,
              Ring Size Guide, Sapphires and others) and three titled posts with their own topics and dates.
            </li>
            <li>
              Fine Jewelry row height. Figma shows one 40px row (Diamond Rings) among 34px rows on desktop. Built with all rows at 34px.
            </li>
            <li>
              Home placeholder copy. Figma shows Latin filler or repeated placeholders in: the collection and guarantee hero bodies, Best
              Sellers card text (&ldquo;Cursus placerat&hellip;&rdquo; on every card), Customer Stories (&ldquo;John &amp; Maria
              Smith&rdquo; on all six), Education Center (&ldquo;Featured Resource Title&rdquo;, &ldquo;Topic Name&rdquo;, &ldquo;Dorem
              ipsum&hellip;&rdquo;), Reviews (&ldquo;Omar Little&rdquo; and the same Latin review three times), the blog row (&ldquo;Post
              Title&rdquo;, &ldquo;Topic&rdquo;, Apr 30, 2025), About, and all five FAQs. Built with short real copy; the layout is as
              designed.
            </li>
            <li>
              Footer blurb. Figma shows Latin filler (&ldquo;Volutpat ridiculus amet tortor&hellip;&rdquo;). Built as &ldquo;Engagement
              rings, wedding bands and fine jewelry from Sky Jewelry in New York.&rdquo;
            </li>
            <li>Spelling. Figma shows &ldquo;counter part&rdquo; in the Home hero and mobile Design Your Own body. Built as &ldquo;counterpart&rdquo;.</li>
            <li>
              Design Your Own setting photo. Figma stretches it to fill a box of a different shape (about 14% out of proportion). Built
              undistorted, contained and aligned to the bottom, so the ring is slightly narrower but keeps Figma&rsquo;s gap below the
              diamond.
            </li>
            <li>
              Raw colours. Figma uses unlinked hex values on some Home buttons (#baa88e border, #432f2b text, no fill), the Education
              Center divider and the FAQ body, and pure #ffffff for the Reviews heading. Built with the matching tokens: Button secondary
              (skin fill, which looks the same on the skin page), secondary/gold, primary/leather and base/white.
            </li>
            <li>Product list: all 16 cards repeat one placeholder product. Built with the sample catalogue.</li>
            <li>
              Price dropdown: the $500 to $5,000,000 range is a placeholder. The slider runs from the lowest to the highest price on the
              page, rounded to $100; the Carat slider likewise runs over the page&rsquo;s carat weights.
            </li>
            <li>Price dropdown panel: placed 2px left of its trigger. Built aligned with the trigger.</li>
            <li>Price dropdown panel shadow: raw #00000005. Built with the shadow-lg token.</li>
            <li>Slider right handle: about 1px past the end of the track. Built flush, like the left handle.</li>
            <li>
              Quick view carat tiles: &ldquo;3.0&rdquo; repeats three times and the formats mix (0.50, 1.0). Built with the
              product&rsquo;s own carat weights, each once, all with two decimals.
            </li>
            <li>Filters sheet Metal label &ldquo;14k Yellow Gold&rdquo;: titles and badges use &ldquo;14K&rdquo;. Built as 14K.</li>
            <li>Filters sheet Category row: shows a scrollbar although its four tiles fit. Built without the scrollbar.</li>
            <li>
              Mobile chips &ldquo;Round&rdquo; and &ldquo;Cut: Excellent&rdquo;: there are no Shape or Cut filters on the page. The chips show
              the filters that are actually applied.
            </li>
            <li>
              &ldquo;Pay in 12 interest-free installments of $145&rdquo; on a $1,200 product: placeholder. The amount is the price divided by
              12, rounded up to the cent.
            </li>
            <li>
              Product page filler text: the Pendant Info note, the Carat note, the Pendant Details, Shipping and Return Policy bodies,
              the What&rsquo;s in the Box captions, the Button Card bodies and the reviews are Latin or &ldquo;Omar Little&rdquo; placeholders. Replaced
              with short neutral copy (the reviews reuse the Home sample reviews); Shipping and Returns only restate the icon row.
            </li>
            <li>
              Product page values disagree with each other: the title says 0.80ct, the selected carat tile 1.00 and the Stone Info card
              0.50; colour J vs I; clarity SI1, VVS2 and VS1; &ldquo;14k White Gold&rdquo; on a yellow gold piece; $1,040 vs $1,200. Built
              from one source: the selected variant, plus one set of sample grades.
            </li>
            <li>Metal composition chart: 37% gold is not 14K, and the donut colours don&rsquo;t match the legend. Built from sample alloy data, with the legend colours.</li>
            <li>&ldquo;Pay in 12 interest free payments of $147.50&rdquo; matches no price on the page. The amount is the price divided by 12.</li>
            <li>Carat label &ldquo;Carat Size&rdquo; (desktop) vs &ldquo;Carat Weight&rdquo; (mobile), and &ldquo;Material&rdquo; vs &ldquo;Metal&rdquo;: built as Carat Weight and Metal, the option names, on both.</li>
            <li>Carat tiles: desktop 0.50 to 5.00 without the title&rsquo;s 0.80; mobile repeats 3.0 and mixes 1.0 / 0.80. Built from the product&rsquo;s own carat weights, two decimals.</li>
            <li>Mobile gallery photo flipped left to right; desktop shows it the right way round. Built unflipped.</li>
            <li>Desktop gallery: pagination dots on one tile of a static grid. Left out.</li>
            <li>Clarity scale: 7 grades on desktop (SI2 hidden), 8 on mobile. Built with 8 on both.</li>
            <li>Quality and info-scale markers placed by fixed pixel offsets, so they land differently on each breakpoint. Placed from the grade.</li>
            <li>Button cards: card 2 is &ldquo;The Sky Guarantee&rdquo; on desktop and &ldquo;Lab-Grown Diamonds&rdquo; on mobile, and card 1&rsquo;s button reads &ldquo;Send us a text&rdquo; / &ldquo;Shop Now&rdquo;. Built with the desktop content on both; card 2&rsquo;s 40% overlay (the hover strength) built at 30%.</li>
            <li>&ldquo;View Certificate&rdquo; is an underlined link on desktop and plain text on mobile. Built underlined on both (and inert, see Open questions).</li>
            <li>
              Landing pages, filler replaced with short neutral copy: hero bodies (Wedding Bands, Diamonds, Fine Jewelry, Gemstones),
              the promo eyebrow &ldquo;Promo Eyebrow&rdquo; (now &ldquo;Sale&rdquo;), the Gemstones hero overline, every tile body
              (&ldquo;Cursus placerat&hellip;&rdquo;), the Consult and Moissanite module bodies, the Button Card bodies, the guarantee icon
              bodies (now restating each title), the Diamond Inspection body and steps, and the section bodies of Shop by Occasion, Shop
              by Price and Gemstone Jewelry. Reviews, Customer Stories and FAQs reuse Home&rsquo;s copy.
            </li>
            <li>Landing placeholder titles: Gemstones shapes (&ldquo;Shape Name&rdquo; &times; 10) named after the shapes in the photos; Diamonds feature cards (&ldquo;Diamonds Subcategory&rdquo; &times; 5) use the menu&rsquo;s Diamond Jewelry links.</li>
            <li>Landing carousels padded by repeating cards (Engagement Ring styles and shapes, Diamonds shapes and colours, Gemstones colours, the second &ldquo;Pav&eacute;&rdquo; on the band rows): built with each card once.</li>
            <li>Spelling: &ldquo;Shop Engagment Rings&rdquo; on the desktop Engagement Rings hero (mobile is correct). Built as &ldquo;Shop Engagement Rings&rdquo;.</li>
            <li>Wedding Bands mobile promo: &ldquo;20% Off&nbsp;&nbsp;Wedding Bands&rdquo; (double space, no &ldquo;Up to&rdquo;). Built as the desktop title.</li>
            <li>Gemstones promo band says &ldquo;Fine Jewelry&rdquo;. Built as &ldquo;Up to 20% Off Gemstones&rdquo;.</li>
            <li>Gemstone Jewelry cards say &ldquo;Read Story&rdquo; although they are category links; the identical Fine Jewelry cards say &ldquo;Shop Now&rdquo;. Built as Shop Now.</li>
            <li>Mobile hero italic &ldquo;by&rdquo; set at 36/40 inside a 48px h1 (Wedding Bands, Diamonds, Fine Jewelry): built at the heading&rsquo;s own italic style, as Typography defines.</li>
            <li>Diamond Inspection step numbers in #030711 (off the palette): built in leather like all other text.</li>
            <li>Fine Jewelry: the mobile closing cards read &ldquo;Shop Now&rdquo; / &ldquo;Lab-Grown Diamonds&rdquo;; built with the desktop (product page) pair. The mobile men &amp; women heading &ldquo;Shop by Type&rdquo; (copied from a hidden heading, with Latin) is built with the desktop heading. The Milestones card&rsquo;s forced line break is dropped.</li>
            <li>
              Menu link icons: Figma strokes most mega menu and mobile menu link icons in primary/hazel (#746345) but 8 in leather (#432f2b):
              Pearl Rings in Fine Jewelry, and the Engagement Rings style icons Solitaire, Halo, Channel-Set, Hidden Halo, Side-Stone,
              Three-Stone and Vintage. Built with every link icon in hazel. The Shop All chevrons stay leather, as Figma draws them.
            </li>
            <li>Footer &ldquo;View our Privacy Policy or Contact Us.&rdquo;: the mobile frame drops the full stop that the desktop frame has. Built with it on both.</li>
            <li>
              Search panel: Figma&rsquo;s search frame shows &ldquo;Education&rdquo; in hazel with no underline, a leftover from the Education menu
              frame it was copied from. Built with all nav items in their default colour while search is open.
            </li>
            <li>
              &ldquo;Have Questions?&rdquo; card photo on mobile (product page and Fine Jewelry). Figma squeezes the desktop crop to about 65% of
              its width to fill the narrower mobile card. Built undistorted with the same framing (same centre and height), so the hands keep
              their shape and a little of the scene at the sides is cropped.
            </li>
            <li>
              Home best sellers: the desktop frame shows 6 cards that repeat two products (Channel Set Ring and Halo Ring); the mobile
              frame shows 8 cards with four products. Built with one product list on both breakpoints: the mobile frame&rsquo;s 8 cards
              and four products.
            </li>
            <li>
              Fine Jewelry &ldquo;Shop our Best Sellers&rdquo;: Figma shows a placeholder overline (&ldquo;Optional Subheader&rdquo;)
              above the heading. Not shown; the same section on Wedding Bands hides its overline.
            </li>
            <li>
              Desktop footer: Figma leaves 41px under the bottom bar, which is leftover space in a fixed-height frame (all three desktop
              footer frames are 857px tall whatever their content). Built with 32px.
            </li>
            <li>Modal - Credit: &ldquo;Pay ever month&rdquo; under Pay in 12. Built as &ldquo;Pay every month&rdquo;, as under Pay in 24.</li>
            <li>
              Modal - JM Info and the protection plans table: &ldquo;We&rsquo;ve partnered with Extend&rdquo; and &ldquo;your Extend
              protection&rdquo;, where every other line names Jeweler&rsquo;s Mutual. Built with Jeweler&rsquo;s Mutual.
            </li>
            <li>
              Care plan prices: Figma&rsquo;s frames show four different prices (the picker $89 / $149, the plans table $150 / $380, and $180
              on the added 3-Year plan). Built with one set everywhere, the picker&rsquo;s $89 (3-Year) and $149 (Lifetime), including the
              plans table and its mobile cards. The bag row keeps &ldquo;from $89/year&rdquo; as drawn.
            </li>
            <li>Bag Special Instructions: &ldquo;I.E gift note&rdquo;. Built as &ldquo;i.e. gift note&rdquo;.</li>
            <li>
              Account email: Figma&rsquo;s sample is a real-looking Gmail address. Built with omar.little@example.com (Figma&rsquo;s sample name
              and addresses are kept).
            </li>
            <li>
              Modal / Add Address - Errors (desktop 4430:48685): the phone field says &ldquo;Please provide a valid email address.&rdquo; Built
              with the mobile frame&rsquo;s &ldquo;Please provide a valid phone number.&rdquo;
            </li>
            <li>
              Account - Order Details (desktop 3565:98015 and 1280 4430:61649): the reused Order Card keeps View Details, which links to the
              page it is on. Built without it, as the mobile frame draws the card there.
            </li>
            <li>Setting page, Meet With Our Consultant: Figma&rsquo;s &ldquo;inour showroom&rdquo; is built as &ldquo;in our showroom&rdquo;.</li>
            <li>Stone page, mobile carat toggle: Figma marks 1.0 under a &ldquo;Shown with 2.50 CT&rdquo; badge. Built marking 2.5, as the desktop frame does.</li>
            <li>Filters / Stone - Expanded draws Polish twice (after Price and again at the end of Advanced Filters). Built once, after Price.</li>
            <li>Stone page specs drawing: Figma labels the side view &ldquo;57.0mm&rdquo; and &ldquo;62.4mm&rdquo;. Those are the table and depth percentages with the wrong unit: built as the stone&rsquo;s table % and depth %, with a % sign.</li>
            <li>Modal - Drop a Hint draws a fifth &ldquo;Recipient Name *&rdquo; field after Your Email (desktop and mobile). Left out.</li>
            <li>Step 3 placeholders built from the ring&rsquo;s own data: the Ring Details text (Latin filler), the Setting Details table&rsquo;s copied values (SKU &ldquo;0.5ct&rdquo;, Width &ldquo;Diamond&rdquo;, Style &ldquo;Polished&rdquo;), the Center Stone Details grades (J, SI1, Oval, against an I VVS2 Round title), the stone row&rsquo;s &ldquo;0.50ct &bull; J &bull; VVS2&rdquo; and the installments&rsquo; $147.50 (not $2,290 / 12).</li>
            <li>Modal - Ring Size: the three steps&rsquo; Latin filler is replaced with plain instructions that match the photos. Modal - Drop a Hint&rsquo;s subheading (Latin filler) reads &ldquo;Let someone know about the ring you&rsquo;ve designed.&rdquo;</li>
            <li>Earrings Step 1 cards: Figma&rsquo;s placeholder title and price (&ldquo;14K Yellow Gold Four Prong Solitaire 0.80ct Lab-Grown Pendant&rdquo;, $1,200) and the pendant photo on one card (7b59aede, the solitaire pendant&rsquo;s): built with the setting&rsquo;s own name, $720 price and photo. The desktop filter row draws Price twice: built once. The mobile chips &ldquo;Round&rdquo; and &ldquo;Cut: Excellent&rdquo; are stone filters: the chips show the setting filters actually applied.</li>
            <li>Earrings pages, mobile step bar: the Setting Info, Stones Info and Complete frames say the ring builder&rsquo;s &ldquo;Setting / Stone / Ring&rdquo;; built with &ldquo;Earrings / Stones / Earrings&rdquo;, as the mobile Step 1 and Step 2 frames say.</li>
            <li>Earrings Setting Info, mobile: &ldquo;Your Diamond&rsquo;s Qualities&rdquo; is visible on a page where no diamond is chosen yet (the desktop frame hides it): left out. The Metal card&rsquo;s &ldquo;14k White Gold&rdquo; and Latin note are built with the chosen metal and &ldquo;Percentages by weight.&rdquo;</li>
            <li>Earrings Stones Info: the mobile title is the setting&rsquo;s name (&ldquo;Four Prong Custom Diamond Stud Earrings in 14K Yellow Gold&rdquo;) and the mobile first thumbnail the earrings photo: built with the pair&rsquo;s title and the diamond&rsquo;s photo, as the desktop frame. The desktop price $720 (the setting&rsquo;s) is the pair&rsquo;s price; &ldquo;Product Name&rdquo; is each diamond&rsquo;s shape; the Certification cards&rsquo; GIA under an IGI title is the pair&rsquo;s own lab; the Carat cards&rsquo; Latin note is &ldquo;The weight of this diamond.&rdquo;</li>
            <li>Earrings Step 3: the pair row&rsquo;s &ldquo;J &bull; VVS2&rdquo; under a VVS1 card and the installments&rsquo; $147.50 are built from the earrings&rsquo; own data.</li>
            <li>Earrings Step 3 model photo badge: Figma&rsquo;s &ldquo;Showing 1.61ct&rdquo; is built as &ldquo;Shown with 1.61 ct&rdquo;, the ring builder&rsquo;s badge wording. Beside a pair of another weight, &ldquo;Showing 1.61ct&rdquo; read as a contradiction.</li>
            <li>Earrings Step 2, mobile heading: the mobile frame (3587:126869) repeats Step 1&rsquo;s &ldquo;Design your own Earrings / Select your Perfect Piece&rdquo;, a leftover. Built with the desktop frame&rsquo;s &ldquo;Select your stone shape and Quality&rdquo; (broken before &ldquo;and&rdquo;, as the ring builder&rsquo;s mobile Step 2).</li>
            <li>Stone first, Step 1&rsquo;s stone cards draw &ldquo;with setting: $1,800&rdquo; before any setting is chosen (Builder Stone First - Stone 5440:31393): the line shows only once a setting is in the ring.</li>
            <li>Stone first, the mobile stone sheet (6683:69132) keeps the setting-first sheet&rsquo;s &ldquo;Complete Ring&rdquo;: built &ldquo;Select Stone&rdquo;, as the desktop hover card, since no setting is chosen yet.</li>
          </ul>
        </Section>

        <Section id="kept-as-figma" title="Kept as Figma despite low contrast">
          <ul className="type-body-sm-regular flex max-w-[48rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>
              Pagination Dots, inactive: black-alpha-20, 1.53:1. Not text, and the current dot is high contrast. Any carousel using dots
              must also offer previous and next buttons or swipe.
            </li>
            <li>
              Pagination Dots - Overlay, inactive: white-alpha-30, 2.56:1 on white-alpha-10 over base/black. Same reason and same carousel
              rule.
            </li>
            <li>Status Marker, Completed=False: secondary/gold dot border, 2.24:1. Not text, and the label beside it names the step.</li>
            <li>Top Bar countdown colons: white-alpha-50, 4.31:1 on leather. Decorative separators.</li>
            <li>Mobile menu category chevrons: secondary/gold, 2.04:1 on ivory. Decorative; the row text names the link.</li>
            <li>Post Card divider: black-alpha-20. Decorative separator between topic and date.</li>
            <li>
              Home hero text over the photo, measured against the photo behind it (10th percentile): the overline 1.8:1 on desktop
              and 2.4:1 on mobile, the heading 2.2:1 on desktop and 2.9:1 on mobile. Kept by decision.
            </li>
            <li>
              Feature Card text over photos (Home feature grid and Customer Stories): titles as low as 2.8:1 (Fine Jewelry, mobile) and
              2.9:1 (a story title, desktop); the &ldquo;Shop Now&rdquo; line 3.6:1 on mobile and 4.4:1 on desktop. Kept by decision.
            </li>
            <li>
              Search panel placeholder: secondary/gold, 2.04:1 on ivory. Display-size hint text on a field that has a visible label
              (&ldquo;Search the site&rdquo;).
            </li>
            <li>
              Step Indicator, Unavailable=True: the item name in leather at 50% opacity, 2.82:1 on skin and 2.73:1 on error-light. This is
              text and does not meet AA. It is kept by decision because the unavailable item is meant to read as de-emphasised.
            </li>
            <li>
              Product page Button Cards: skin text over the photos with Figma&rsquo;s gradient (30% desktop, 50% mobile). Measured 10th
              percentile / median: desktop title 4.1 / 7.4:1, body 4.7 / 9.0:1; mobile title 4.2 / 6.6:1, body 4.1 / 5.2:1.
            </li>
            <li>
              Landing heroes and feature cards: white or skin text over Figma&rsquo;s photos and gradients. Measured 10th percentile / median
              for the h1: Engagement Rings 2.2 / 4.5 desktop, Wedding Bands 2.7 / 4.0, Diamonds 3.6 / 5.7, Fine Jewelry 2.8 / 3.0 (the
              pale flat-lay photo, the weakest), Gemstones 3.0 / 3.4. Feature card titles 2.5 to 3.8 at the 10th percentile. Full table
              in the Task 11 report.
            </li>
            <li>Modal - Credit: the inactive Klarna tab label at black-alpha-20 (inert, as drawn).</li>
            <li>Stone unavailable (Step 3 and the bag): the struck stone summary, the stone&rsquo;s price, the Total Price and the bag stone row&rsquo;s attributes at 50%, as Figma draws them (about 2.8:1). Kept for the same reason as the Step Indicator&rsquo;s Unavailable name: the unavailable stone is meant to read as de-emphasised.</li>
            <li>Pair unavailable (earrings Step 3 and the bag): the same struck values at 50%, as the ring&rsquo;s.</li>
          </ul>
        </Section>

        <Section id="open-questions" title="Open questions">
          <ul className="type-body-sm-regular flex max-w-[48rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>
              When is the one-row header used, and is the header sticky? For now (Rob&rsquo;s decision, Nov 20) the two-row header scrolls
              away and the one-row bar is the sticky header on desktop; see Deviations.
            </li>
            <li>
              Should the mobile announcement messages auto-scroll as a ticker? The site now shows the countdown Top Bar, as every Figma page
              frame does, so this applies only if the messages variant is used again. In that variant they scroll sideways by swipe or keyboard.
            </li>
            <li>
              Home hero photo needs a larger original from the designer: Figma&rsquo;s source is 1098px wide; the desktop slot is 1440px,
              so 1440px (2880px for 2x screens) is needed.
            </li>
            <li>
              Sky guarantee photo (Home section 12) needs a larger original from the designer: Figma&rsquo;s source is 603px wide; the
              desktop slot is 1440px, so 1440px (2880px for 2x screens) is needed.
            </li>
            <li>
              Menu icons with no proper match in Assets, kept as Figma: Wedding Bands For Him, Carved (Oval) and Alternative Metal (Pear),
              and Start with a Moissanite (Natural Diamond).
            </li>
            <li>
              Product list motion: the Animations page has nothing for dropdowns, sheets, card hover or View More. Built with the
              site&rsquo;s 300ms ease-out (sheets slide up and the hovered photo zooms 1.067; the card shell appears without a fade), and none under reduced motion.
            </li>
            <li>Filters sheet: Figma draws no close button. Escape and a tap outside close it without applying.</li>
            <li>Open dropdown: the chevron keeps pointing down, as in Figma.</li>
            <li>
              Quick view Metal and Stone tiles: their chevrons suggest pickers, which belong to the product page. For now the tiles show the
              current metal and stone and are not interactive.
            </li>
            <li>&ldquo;Learn more&rdquo; in the installments line opens the Credit modal, which is held. For now it is plain text.</li>
            <li>Bracelet lengths: not in Figma. Built as 6&ndash;7&rdquo; and 7&ndash;8&rdquo; under &ldquo;Length&rdquo;.</li>
            <li>Ships by and Sort by options are not designed. Built with the Dropdown option list.</li>
            <li>
              Product photos of the other metals for necklaces, earrings and bracelets (white gold, rose gold and platinum). Figma has these
              designs in yellow gold only, so their cards show one metal swatch. For the ring builder: photos for oval, princess, asscher,
              heart and pear diamonds and the other coloured stones (they show a line drawing for now); a photo per carat size for the carat
              toggle; a cut-out ring for the step bar.
            </li>
            <li>360° image sequences needed: the 360° marker, tabs and viewer stay off (SHOW_360) until they exist. Requested: a turntable sequence of each ring setting in each metal colour, of the earring setting, and of one diamond per shape (36 frames per turn, square, on the same background and lighting as the product photos), named &ldquo;&lt;photo&gt;-spin-01&rdquo; to &ldquo;-spin-36&rdquo;. Recommendation: start with the six listed ring settings and the earring setting, then add the diamonds.</li>
            <li>
              Product page sample data with no source in the catalogue: metal composition, diamond grades and grading lab, stone
              dimensions. All kept in src/content/product-detail.ts until real data exists (Shopify metafields could hold them).
            </li>
            <li>Ring size: Figma has a hidden &ldquo;Select Ring Size&rdquo; dropdown, and the catalogue has no ring size option. Not built.</li>
            <li>Center Stone Shape picker (desktop) and the mobile Stone picker: each product has one fixed shape, so there is nothing to pick. Not shown.</li>
            <li>Product page motion: the Animations page only has the ring builder&rsquo;s add-to-bag loaders. Gallery swipes are smooth (instant under reduced motion); the 360° viewer&rsquo;s hint (switched off for now) fades after the first turn.</li>
            <li>
              Product list routes for the landing pages: the menus link /engagement-rings/, /diamonds/ and /gemstones/ with filters, but
              those are now the landing pages. The landing tiles link to planned lists at /&lt;category&gt;/shop/?&hellip;; the menus
              should move there when the lists are built.
            </li>
            <li>Fine Jewelry: the occasion, women&rsquo;s and men&rsquo;s tiles link to planned routes with no matching filter yet.</li>
            <li>Landing photos: the band rows use engagement-ring photos; best sellers use the catalogue&rsquo;s bands (there are no wedding bands); Gemstones carousels use coloured-diamond photos; Platinum reuses the white gold photo; the Wedding Bands and Gemstones heroes, the guarantee photo and the men&rsquo;s card photo are below 2x for their slots.</li>
            <li>
              Filters sheet and desktop Metal panel: the badge is at 15px on both Yellow Gold tiles and 8px on the other five. Which is
              intended, and should it change on selection?
            </li>
            <li>Title-to-body gap is 12px on the Sky Guarantee card and 20px on the Consult module on the same page. Which is intended?</li>
            <li>Gemstones: the heading says &lsquo;Birthstone&rsquo; on desktop and &lsquo;Gemstones&rsquo; on mobile. Which is intended?</li>
            <li>Product page mobile: the Carat and Dimensions cards are fixed 4px taller than the cards beside them. Is that intended?</li>
            <li>Filters sheet: frame 5746:89744 shows it expanded to 950px. How does the sheet reach that state?</li>
            <li>Care plan prices differ between the picker, the plans table and the bag row. Which are right?</li>
            <li>Two versions of the plans modal are drawn, and mobile v2 has no Select Plan. Which is current?</li>
            <li>Bag page: Return Policy on desktop, Sky Repairs on mobile. Should both show both, or is each intended for its breakpoint?</li>
            <li>Bag page: This is a Gift is mobile only; Back to Shopping and Perfectly Paired Wedding Bands are desktop only. Intended?</li>
            <li>Bag added care plan: &ldquo;Change&rdquo; on desktop, &ldquo;Edit&rdquo; on mobile; unavailable plan: &ldquo;Remove Plan&rdquo; and &ldquo;Remove&rdquo;. Which wording?</li>
            <li>Is checkout meant to be blocked while a stone or care plan is unavailable? Desktop draws it at 60%, mobile dark.</li>
            <li>Should an added care plan be removable, and how?</li>
            <li>Account: Figma draws no sign-in, sign-out or sign-up screens. Are they planned?</li>
            <li>What does Opt Out under Sky Repairs do?</li>
            <li>Address cards: should a saved address show its company and phone number?</li>
            <li>How should orders that aren&rsquo;t delivered yet look?</li>
            <li>
              Order Details photos: the 1440 frame rounds them 4px; the 1280 frame, the mobile frame and the Design System&rsquo;s Product
              Order Detail don&rsquo;t. Built square. Which is right?
            </li>
            <li>Photos are needed for Channel Set, Halo, Side-Stone and Eternity before they can be listed in the builder.</li>
            <li>Stone first, &ldquo;Choose your Setting&rdquo; (desktop Modal - Ring Size 7 5440:36621, mobile Modal - Setting Type 6683:73402): the prototype opens it from Select Stone and Select Your Setting, but its Pendant Setting card leads nowhere and no pendant builder is drawn. Not built; Select Stone goes straight to the ring settings. Recommendation: drop it until a pendant builder is designed.</li>
            <li>&ldquo;Choose your Stone&rdquo; (Modal - Ring Size 8 7389:99059: Natural Diamond, Lab Grown Diamond (Recommended), Gemstone): nothing opens it, and its first card links to the settings. Not built. Recommendation: drop it; the menus already start each stone type.</li>
            <li>Stone first, Step 2&rsquo;s third promo card is &ldquo;Can&rsquo;t Decide? Take our quiz &hellip; Start the Quiz&rdquo;, but no quiz is drawn. The setting-first promo card is kept. Recommendation: design the quiz, or keep the promo.</li>
            <li>Stone first, the setting page&rsquo;s Center Stone Shape and Stone pickers: Figma draws every shape and both origins, but choosing another value would contradict the stone already chosen, and nothing shows what it should do. Kept showing only the chosen stone&rsquo;s shape and origin (Rob&rsquo;s decision, Nov 21). Open: should the frames draw them that way, or change the stone?</li>
            <li>The stone&rsquo;s page title: the stone-first desktop frame writes &ldquo;0.50 Carat I VVS2 Round Natural Diamond&rdquo;, the setting-first one &ldquo;2.50ct I VVS2 &hellip;&rdquo;; each is built as drawn. Recommendation: one form for both.</li>
            <li>&ldquo;Start with a Pendant&rdquo; (Diamonds menu) has no design and stays as it was. Recommendation: draw a pendant builder or drop the link.</li>
            <li>The &ldquo;Badge Design&rdquo; section beside the stone-first frames (6227:35727: a &ldquo;Ships Fast&rdquo; badge on a product card) is not used by any frame. Not built. Recommendation: say where it belongs.</li>
            <li>Ring builder: Remove Setting and Remove Stone are drawn, and built, on mobile only.</li>
            <li>Ring builder installments: setting cards say &ldquo;Pay in 12&rdquo; and stone cards &ldquo;Pay in 4&rdquo;; each is built as drawn.</li>
            <li>Ring builder step bar: one frame repeats the price inside the setting&rsquo;s name; built with the name and one price.</li>
            <li>Stone page title: desktop &ldquo;2.50ct &hellip;&rdquo; and mobile &ldquo;0.50 Carat &hellip;&rdquo;; each is built as drawn.</li>
            <li>Ring builder Step 2 has no switch between diamonds and gemstones; gemstone mode is reached from the gemstone menu links.</li>
            <li>Stone list: what does the &ldquo;3&rdquo; badge beside Advanced Filters count? Built as the number of active advanced filters.</li>
            <li>Stone filters differ by breakpoint, each built as drawn: Certificate is in the desktop diamond filters but not the mobile sheet; Type is on desktop gemstones but not in the mobile sheet.</li>
            <li>Should choosing a grade in the Cut / Color / Clarity modal set the filter? Built to change the explanation only.</li>
            <li>Step 3: the loose &ldquo;Alternate Loading State&rdquo; (6579:198626) is hidden and not built, and the Animations page&rsquo;s add-to-bag loaders are not used. Should Add to Bag show a loader?</li>
            <li>Drop a Hint: nothing draws what follows Send Hint. It closes the modal with no confirmation message (Rob&rsquo;s decision, Nov 20; the mobile prototype closes it too); nothing is sent or stored.</li>
            <li>Drop a Hint, mobile: three frames are visible (1 and 2 with Edit / Preview tabs, and v2, one long sheet). Built from v2, the newest. Right? Should the preview fill its blanks with the names typed, and should Ring Size start with the size chosen on the page?</li>
            <li>Ring size converter: should the result set the page&rsquo;s ring size? (No control for it is drawn.)</li>
            <li>Mobile Stone Summary and Setting Summary sheets (7327:32013, 7327:32090): no Step 3 frame opens them, so they are not built. Where do they belong?</li>
            <li>Photos needed for Step 3&rsquo;s fourth gallery tile: a second photo of each setting in each metal. Only Classic Solitaire in yellow gold has one; Vine (all metals), Classic Solitaire in white gold and platinum, Petite Solitaire, Pav&eacute;, Round Halo and Marquise Side-Stone show the worn photo with &ldquo;Shown with 2.50 ct&rdquo; there for now. Figma&rsquo;s own tile (6579:194578) is not a second view: it is Vine&rsquo;s white gold photo (the same image, 1c5a2a97) flipped left to right, so it was not added (the engraving would read backwards).</li>
            <li>Earrings builder: one setting. Figma&rsquo;s only earring setting photos are the yellow gold four prong studs (front, with backs, worn), the same three photos the Fine Jewelry four prong studs use; the Assets page has none. A photo of each further setting (and of the studs in white and rose gold) is needed before more settings or metals can be listed.</li>
            <li>Earrings builder: &ldquo;Choose your Stones&rdquo; (Add Diamonds / Add Gemstones) is in the prototype, but no gemstone earrings step is drawn and Add Gemstones links nowhere. Not built; Select These Earrings goes to the diamonds. Recommendation: draw the gemstone pair step, or drop the modal.</li>
            <li>Earrings Step 3 desktop draws a gold rule and then the Setting Info row&rsquo;s own rule 32px below it (two rules); built as drawn. Mobile draws Setting Info as a section above the diamonds; desktop as an accordion row after them; each built as drawn.</li>
          </ul>
        </Section>

        <Section id="held" title="Held for review">
          <ul className="type-body-sm-regular flex max-w-[40rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>
              &ldquo;View Certificate&rdquo; on the product page: shown as designed but inert (plain text, not a link) until certificate
              files exist. (&ldquo;Drop a hint&rdquo; now opens Modal - Drop a Hint; see Deviations.)
            </li>
            <li>Modal - Credit: the Klarna tab and the arrows are shown but inert (only the Affirm tab is drawn).</li>
            <li>
              Bag Return Policy and Sky Repairs &ldquo;Learn More&rdquo;, and the plans table&rsquo;s &ldquo;Visit support page&rdquo; and terms
              links: shown as designed but inert, as there are no pages for them yet.
            </li>
            <li>Product card &ldquo;Learn more&rdquo; (hover state): stays inert; the product page, quick view and bag open Modal - Credit.</li>
            <li>
              Ring builder Step 3 (/design-your-own/complete/), drawn without a result: &ldquo;View Certificate&rdquo; (plain text) and the
              add-to-bag loaders from the Animations page. A mock order from checkout is not part of it.
            </li>
            <li>
              Ring builder, drawn without a result: Quick Checkout and Meet With Our Consultant&rsquo;s &ldquo;Book Now&rdquo; on the
              setting page (shown as designed, inert); the video and the carat tabs on the gallery photos (left out); &ldquo;View Certificate&rdquo; on stones (plain text). The same on the stone-first pages (Quick Checkout stays on the stone-first setting page, as drawn).
            </li>
            <li>Quick Checkout&rsquo;s open states (on the Accordion page; unnamed variants Open3, Open4): the closed card is on the setting page, inert. Part 2 (Step 3) doesn&rsquo;t cover it.</li>
            <li>Landing page live chat and text actions (no chat or messaging service to connect to).</li>
            <li>
              Account: Log Out, Account Details Edit, the address cards&rsquo; Edit and Remove, Sky Repairs Opt Out, Download Certificate and
              the Sky Repair Requests &ldquo;Request&rdquo; links have no drawn destination or flow: shown as designed but inert.
            </li>
            <li>
              Account address Edit and Remove flows: not drawn beyond the links. Editing might reuse Modal / Add Address (as &ldquo;Edit
              Address&rdquo;) and Remove might ask for confirmation; both wait for a design.
            </li>
            <li>Stone list: the question marks Figma draws on Carat, the gemstone Color and Certificate are left out (nothing is drawn for them to open). &ldquo;Learn more&rdquo; on the stone hover card is inert, as on the product card; in the mobile sheet it opens Modal - Credit.</li>
            <li>Earrings builder, drawn without a result: &ldquo;View Certificate&rdquo; (plain text) and &ldquo;Learn more&rdquo; on the pair hover card (inert, as on the stone card). Drop a Hint sends nothing, as on the ring builder.</li>
          </ul>
        </Section>
      </main>
      <GridOverlay />
    </>
  );
}
