import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Header } from "@/components/site/Header";
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

export default function ComponentsPage() {
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
              <Item label="Tabs - Line with the full-width rule (mobile gallery)"><GalleryTabsDemo /></Item>
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
              &ldquo;Added to bag&rdquo; confirmation: a temporary stand-in for the bag panel, not in Figma. A short message at the bottom of
              the screen, announced to screen readers.
            </li>
            <li>
              Asset gap, 360° view: no product has a 360° image sequence, so the 360° tile (desktop) and the &ldquo;360° View / Images&rdquo;
              tabs (mobile) are hidden. The viewer is built and appears as soon as a product has images named &ldquo;&hellip;-spin-01&rdquo;,
              &ldquo;-spin-02&rdquo;&hellip;
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
          </ul>
        </Section>

        <Section id="open-questions" title="Open questions">
          <ul className="type-body-sm-regular flex max-w-[48rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>
              When is the one-row header used, and is the header sticky? For now the header is two-row and scrolls with the page, and the
              one-row bar is an unused option.
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
              designs in yellow gold only, so their cards show one metal swatch.
            </li>
            <li>360° image sequences for the products (the viewer is ready; no sequences exist).</li>
            <li>
              Product page sample data with no source in the catalogue: metal composition, diamond grades and grading lab, stone
              dimensions. All kept in src/content/product-detail.ts until real data exists (Shopify metafields could hold them).
            </li>
            <li>Ring size: Figma has a hidden &ldquo;Select Ring Size&rdquo; dropdown, and the catalogue has no ring size option. Not built.</li>
            <li>Center Stone Shape picker (desktop) and the mobile Stone picker: each product has one fixed shape, so there is nothing to pick. Not shown.</li>
            <li>Product page motion: the Animations page only has the ring builder&rsquo;s add-to-bag loaders. Gallery swipes are smooth (instant under reduced motion); the 360° hint fades after the first turn.</li>
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
          </ul>
        </Section>

        <Section id="held" title="Held for review">
          <ul className="type-body-sm-regular flex max-w-[40rem] list-disc flex-col gap-space-2 pl-space-5">
            <li>Shop All: a checkout bar with a price. Planned for the bag and checkout tasks.</li>
            <li>Quanity Select: variants are unnamed. Planned for the bag and checkout tasks.</li>
            <li>Modal - CCC Filters, Modal / Care Plan and Modal - Credit: content-specific modals, held for their page tasks.</li>
            <li>
              &ldquo;Drop a hint&rdquo;, the installments &ldquo;Learn more&rdquo; and &ldquo;View Certificate&rdquo; on the product page: shown as
              designed but inert (plain text, not links or buttons) until their modals and certificate files exist.
            </li>
            <li>
              Engagement ring product pages (/engagement-rings/&hellip;, linked from the Home best sellers): they belong to the ring builder
              stage. The Home links stay as they are.
            </li>
            <li>
              Ring builder pages (mobile 3587:125910 &ldquo;Builder 2 - Stone Info&rdquo; and 3587:125411 &ldquo;Builder 3 - Complete&rdquo;):
              step bar, loose-diamond viewer, Diamond Specs, Carat Size Guide, setting and diamond summary cards, Total Price, Your Setting
              Info, Ring Details, and the add-to-bag loaders. Held for the ring builder.
            </li>
            <li>Quick Checkout (on the Accordion page): product-page content with unnamed variants (Open3, Open4), held for the product page.</li>
            <li>Landing page live chat and text actions (no chat or messaging service to connect to).</li>
          </ul>
        </Section>
      </main>
      <GridOverlay />
    </>
  );
}
