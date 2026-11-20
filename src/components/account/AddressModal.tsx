"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dropdown } from "@/components/ui/Dropdown";
import { IconButton } from "@/components/ui/IconButton";
import { Input, InputMessage } from "@/components/ui/Input";
import { DialogShell, dialogPanelMotion } from "@/components/ui/Modal";
import { cx } from "@/components/ui/shared";
import { addressModal, validPhone } from "@/content/account";
import { addAddress } from "@/lib/accountAddresses";

type Fields = { company: string; address1: string; address2: string; city: string; state: string; zip: string; country: string; phone: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { company: "", address1: "", address2: "", city: "", state: "", zip: "", country: "", phone: "" };

/** The fields Figma marks with an asterisk, in form order. */
const REQUIRED = ["address1", "city", "state", "zip", "country", "phone"] as const;
const fieldName = (label: string) => label.replace(/\s*\*$/, "");

/**
 * Every starred field is required, with the wording of the drawn "City is required"; the phone number must also be
 * valid ("Please provide a valid phone number."). The Errors frames (4430:48685, 4430:61388) only draw City and Phone;
 * the other required fields are inferred from their asterisks (Deviations).
 */
function validate(fields: Fields): Errors {
  const errors: Errors = {};
  for (const key of REQUIRED) {
    if (!fields[key].trim()) errors[key] = addressModal.errors.required(fieldName(addressModal.fields[key]));
  }
  if (!errors.phone && !validPhone(fields.phone)) errors.phone = addressModal.errors.phoneInvalid;
  return errors;
}

type AddressModalProps = { open: boolean; onClose: () => void };

/**
 * Figma "Modal / Add Address" (desktop 3565:97033, 612px; mobile "Expanded" 3587:123484, a 350px card 20px from the
 * screen edges) with its filled (3565:97059) and error states. Save keeps the address in this browser only
 * (src/lib/accountAddresses.ts); "Set as default address" moves the Default badge. The parent remounts it on each
 * opening, so it always starts empty.
 */
export function AddressModal({ open, onClose }: AddressModalProps) {
  const headingId = useId();
  const f = addressModal.fields;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [makeDefault, setMakeDefault] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const messageId = useId();

  const set = (key: keyof Fields) => (value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    // After a failed Save, each fix clears its own message as the field becomes valid.
    if (tried) setErrors(validate(next));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    setTried(true);
    if (Object.keys(found).length) {
      // Focus the first field with an error, in form order, once the error states have rendered.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    addAddress(
      {
        company: fields.company.trim() || undefined,
        address1: fields.address1.trim(),
        address2: fields.address2.trim() || undefined,
        city: fields.city.trim(),
        state: fields.state,
        zip: fields.zip.trim(),
        country: fields.country,
        phone: fields.phone.trim(),
      },
      makeDefault,
    );
    onClose();
  };

  const input = (key: Exclude<keyof Fields, "state" | "country">, label: string, extra: Partial<Parameters<typeof Input>[0]> = {}) => (
    <Input
      label={label}
      value={fields[key]}
      onChange={(event) => set(key)(event.target.value)}
      name={key}
      aria-required={(REQUIRED as readonly string[]).includes(key) || undefined}
      error={Boolean(errors[key])}
      message={errors[key]}
      {...extra}
    />
  );

  const dropdown = (key: "state" | "country", options: { value: string; label: string }[]) => (
    <div className="flex flex-col gap-space-1">
      <Dropdown
        label={fieldName(f[key])}
        placeholder={f[key]}
        options={options}
        value={fields[key] || undefined}
        onChange={set(key)}
        required
        error={Boolean(errors[key])}
        describedBy={errors[key] ? `${messageId}-${key}` : undefined}
      />
      {errors[key] ? (
        <InputMessage id={`${messageId}-${key}`} status="error">
          {errors[key]}
        </InputMessage>
      ) : null}
    </div>
  );

  return (
    <DialogShell open={open} onClose={onClose} labelledBy={headingId}>
      {({ visible }) => (
        <form
          ref={formRef}
          noValidate
          onSubmit={submit}
          className={cx(
            "relative m-space-5 flex max-h-[calc(100dvh-2.5rem)] flex-1 flex-col overflow-hidden rounded-8 bg-secondary-skin text-primary-leather shadow-lg ring-1 ring-black-alpha-2",
            "ui-desktop:m-0 ui-desktop:max-h-[calc(100dvh-3rem)] ui-desktop:max-w-[38.25rem]",
            dialogPanelMotion(visible),
          )}
        >
          <IconButton icon="close" label="Close" size="xs" variant="ghost" onClick={onClose} className="absolute top-space-5 right-space-5 z-10 ui-desktop:top-space-6 ui-desktop:right-space-6" />
          <div className="min-h-0 overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-space-6 px-space-5 pt-space-5 ui-desktop:px-space-8 ui-desktop:pt-space-6">
              <h2 id={headingId} className="type-heading-md pr-space-10">
                {addressModal.heading}
              </h2>
              <div className="flex flex-col gap-space-4 ui-desktop:grid ui-desktop:grid-cols-2 ui-desktop:items-start ui-desktop:gap-space-5">
                {input("company", f.company, { className: "ui-desktop:col-span-2", autoComplete: "organization" })}
                {input("address1", f.address1, { className: "ui-desktop:col-span-2", autoComplete: "address-line1" })}
                {input("address2", f.address2, { className: "ui-desktop:col-span-2", autoComplete: "address-line2" })}
                {input("city", f.city, { autoComplete: "address-level2" })}
                {dropdown("state", addressModal.states)}
                {input("zip", f.zip, { autoComplete: "postal-code", inputMode: "numeric" })}
                {dropdown("country", addressModal.countries)}
                {input("phone", f.phone, { className: "ui-desktop:col-span-2", type: "tel", autoComplete: "tel" })}
              </div>
              <Checkbox size="md" className="ui-desktop:min-h-[1.375rem]" label={addressModal.setDefault} checked={makeDefault} onChange={(event) => setMakeDefault(event.target.checked)} />
            </div>
            <div className="flex gap-space-2 p-space-5 ui-desktop:gap-space-4 ui-desktop:p-space-8">
              <Button type="submit" size="responsive" className="flex-1">
                {addressModal.save}
              </Button>
              <Button type="button" size="responsive" variant="secondary" onClick={onClose} className="ui-desktop:flex-1">
                {addressModal.cancel}
              </Button>
            </div>
          </div>
        </form>
      )}
    </DialogShell>
  );
}
