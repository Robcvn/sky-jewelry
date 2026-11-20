"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { IconButton } from "@/components/ui/IconButton";
import { Input, TextArea } from "@/components/ui/Input";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { Picture, type ImageRef } from "@/components/ui/Picture";
import { cx } from "@/components/ui/shared";
import { builderContent, RING_SIZES, ringSizeLabel } from "@/content/builder";

const copy = builderContent.dropHint;

type Fields = { recipientName: string; recipientEmail: string; yourName: string; yourEmail: string; ringSize: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const EMPTY: Fields = { recipientName: "", recipientEmail: "", yourName: "", yourEmail: "", ringSize: "", message: "" };
const REQUIRED = ["recipientName", "recipientEmail", "yourName", "yourEmail"] as const;
const fieldName = (label: string) => label.replace(/\s*\*$/, "");
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  for (const key of REQUIRED) if (!fields[key].trim()) errors[key] = copy.errors.required(fieldName(copy.fields[key]));
  if (!errors.recipientEmail && !validEmail(fields.recipientEmail)) errors.recipientEmail = copy.errors.email;
  if (!errors.yourEmail && !validEmail(fields.yourEmail)) errors.yourEmail = copy.errors.email;
  return errors;
}

/** A blank line in the letter, as Figma draws it (a rule the width of a short name). */
function Blank({ width }: { width: string }) {
  return (
    <span className={cx("inline-block border-b border-primary-leather align-baseline", width)}>
      <span className="sr-only">{copy.blank}</span>
    </span>
  );
}

/** The left column on desktop, the Preview section on mobile: the ring, its name and the letter. */
function Preview({ name, image, heading }: { name: string; image: ImageRef; heading?: ReactNode }) {
  return (
    <div className="flex flex-col gap-space-6">
      {heading}
      <div className="flex flex-col gap-space-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-4 bg-[radial-gradient(var(--color-base-white),var(--color-secondary-skin))]">
          <Picture image={{ ...image, alt: "" }} sizes={{ desktop: "32rem", mobile: "calc(100vw - 2.5rem)" }} className="absolute inset-0 size-full object-cover mix-blend-multiply" />
        </div>
        <p className="type-body-xs-medium ui-desktop:text-center">{name}</p>
      </div>
      <div className="type-body-xs-regular flex flex-col gap-space-4">
        <p>
          {copy.letter.dear} <Blank width="w-[4.5rem]" />,
        </p>
        <p>
          <Blank width="w-[6.5rem]" /> {copy.letter.body}
        </p>
        <p>
          {copy.letter.signoff[0]}
          <br />
          {copy.letter.signoff[1]}
        </p>
      </div>
    </div>
  );
}

type DropHintModalProps = {
  open: boolean;
  onClose: () => void;
  /** The piece's name: on Step 3 the ring's, as Figma's preview writes it ("The Twig with a 0.61 Carat F VVS2 Round Natural Diamond"); on the product page the product's. */
  name: string;
  image: ImageRef;
  /** The optional Ring Size field. The product page leaves it out for pieces that aren't rings (inferred). */
  ringSize?: boolean;
};

/**
 * "Modal - Drop a Hint" (desktop 3565:101590: 1200 wide, the preview beside the form; mobile "Modal - Drop a Hint
 * (v2)" 6683:201301, the current mobile frame: the form, then the Preview, with Send Hint in a bar at the bottom).
 * Front end only: Send Hint checks the four starred fields with the Design System's input error state, then closes.
 * Nothing is sent or stored. Figma's duplicated fifth "Recipient Name" field is left out (a corrected oversight).
 * The parent remounts it on each opening, so it always starts empty. The product page opens it too, with the
 * product's photo and name in the preview (inferred: Figma draws it for the ring).
 */
export function DropHintModal({ open, onClose, name, image, ringSize = true }: DropHintModalProps) {
  const headingId = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const f = copy.fields;

  const set = (key: keyof Fields) => (value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    // After a failed Send, each fix clears its own message as the field becomes valid.
    if (tried) setErrors(validate(next));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    setTried(true);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    // Not drawn: what follows Send Hint. The mobile prototype closes the modal; nothing is sent.
    onClose();
  };

  const input = (key: (typeof REQUIRED)[number], type: "text" | "email", autoComplete: string) => (
    <Input
      label={f[key]}
      size="sm"
      type={type}
      name={key}
      autoComplete={autoComplete}
      aria-required
      value={fields[key]}
      onChange={(event) => set(key)(event.target.value)}
      error={Boolean(errors[key])}
      message={errors[key]}
    />
  );

  const optional = (label: string) => (
    <>
      {label} <span className="text-black-alpha-60">{f.optional}</span>
    </>
  );

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={headingId}>
      {({ visible }) => (
        <form
          ref={formRef}
          noValidate
          onSubmit={submit}
          data-drop-hint
          className={cx(
            "relative flex max-h-[calc(100dvh-var(--spacing-space-6))] w-full flex-col overflow-hidden rounded-t-8 bg-secondary-skin text-primary-leather shadow-lg ring-1 ring-black-alpha-2",
            "ui-desktop:max-h-[calc(100dvh-var(--spacing-space-12))] ui-desktop:max-w-[75rem] ui-desktop:rounded-4",
            dialogPanelMotion(visible),
          )}
        >
          <IconButton icon="close" label="Close" size="sm" variant="ghost" onClick={onClose} className="absolute top-space-4 right-space-4 z-10 ui-desktop:top-space-5 ui-desktop:right-space-5 ui-desktop:size-space-10" />
          <div className="min-h-0 overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-space-5 p-space-5 ui-desktop:gap-space-8 ui-desktop:p-space-13">
              <div className="flex flex-col gap-space-2 text-center ui-desktop:gap-space-3">
                <h2 id={headingId} className="type-heading-caps-md px-space-10 ui-desktop:type-heading-caps-lg">
                  {copy.heading}
                </h2>
                <p className="type-p-xs-regular ui-desktop:type-p-sm-regular">{copy.intro}</p>
              </div>
              <div className="flex flex-col gap-space-8 ui-desktop:grid ui-desktop:grid-cols-2 ui-desktop:gap-space-11">
                <div className="order-2 ui-desktop:order-1">
                  <Preview
                    name={name}
                    image={image}
                    heading={<h3 className="type-heading-caps-sm text-center ui-desktop:sr-only">{copy.preview}</h3>}
                  />
                </div>
                <div className="order-1 flex flex-col gap-space-6 ui-desktop:order-2">
                  <div className="flex flex-col gap-space-3 ui-desktop:gap-space-4">
                    {input("recipientName", "text", "off")}
                    {input("recipientEmail", "email", "off")}
                    {input("yourName", "text", "name")}
                    {input("yourEmail", "email", "email")}
                    {ringSize ? (
                      <Dropdown
                        label={f.ringSize}
                        placeholder={optional(f.ringSize)}
                        size="sm"
                        options={RING_SIZES.map((size) => ({ value: size, label: ringSizeLabel(size) }))}
                        value={fields.ringSize || undefined}
                        onChange={set("ringSize")}
                      />
                    ) : null}
                    <TextArea label={optional(f.message)} name="message" value={fields.message} onChange={(event) => set("message")(event.target.value)} />
                  </div>
                  {/* Desktop: under the fields. (A wrapper hides it on mobile: the Button's own display would win over "hidden".) */}
                  <div className="hidden ui-desktop:block">
                    <Button type="submit" className="w-full">
                      {copy.send}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile v2: Send Hint in a bar at the bottom of the sheet. */}
          <div className="shrink-0 bg-secondary-skin p-space-5 ui-desktop:hidden">
            <Button type="submit" className="w-full">
              {copy.send}
            </Button>
          </div>
        </form>
      )}
    </DialogShell>
  );
}
