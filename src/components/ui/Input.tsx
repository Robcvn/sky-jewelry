import { useId, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes } from "react";
import { Icon, type IconName } from "./Icon";
import { cx, type PreviewState } from "./shared";

type MessageStatus = "error" | "info" | "success";

const MESSAGE = {
  error: { icon: "warning-circle", box: "bg-state-error text-secondary-skin", iconColor: "text-secondary-skin" },
  info: { icon: "info", box: "bg-secondary-ivory text-primary-leather", iconColor: "text-secondary-gold" },
  success: { icon: "check-circle", box: "bg-state-success text-secondary-skin", iconColor: "text-secondary-skin" },
} as const;

export function InputMessage({
  status = "error",
  id,
  children,
}: {
  status?: MessageStatus;
  id?: string;
  children: ReactNode;
}) {
  const message = MESSAGE[status];

  return (
    <p id={id} className={cx("type-ui-xs-medium flex items-start gap-space-1 rounded-4 p-space-1", message.box)}>
      <Icon name={message.icon} size={16} className={message.iconColor} />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "placeholder"> & {
  /** Passed to the <input>, e.g. to move focus to a field with an error. */
  ref?: Ref<HTMLInputElement>;
  /** Shown as the placeholder, and as the small floating label on filled MD inputs. */
  label: string;
  /** "responsive" is SM below 1024px and MD from 1024px, without the floating label. */
  size?: "md" | "sm" | "responsive";
  /** Figma "Input - Dark". */
  dark?: boolean;
  error?: boolean;
  message?: ReactNode;
  messageStatus?: MessageStatus;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconClick?: () => void;
  rightIconLabel?: string;
  previewState?: PreviewState;
};

export function Input({
  label,
  size = "md",
  dark = false,
  error = false,
  message,
  messageStatus,
  leftIcon,
  rightIcon,
  onRightIconClick,
  rightIconLabel,
  previewState,
  className,
  id,
  disabled,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const iconSize = size === "md" ? 24 : 20;
  const floats = size === "md" && !dark;
  const status = messageStatus ?? (error ? "error" : "info");

  return (
    <div className={cx("flex w-full flex-col gap-space-1", className)}>
      <div
        data-state={previewState}
        className={cx(
          "ui-transition flex items-center rounded-4 border has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2",
          size === "md"
            ? "min-h-space-12 gap-space-2 px-space-4"
            : size === "sm"
              ? "min-h-space-10 gap-space-1 px-space-3"
              : "min-h-space-10 gap-space-1 px-space-3 ui-desktop:min-h-space-12 ui-desktop:gap-space-2 ui-desktop:px-space-4",
          dark
            ? "has-[input:focus-visible]:outline-base-white text-secondary-skin"
            : "has-[input:focus-visible]:outline-primary-leather text-primary-leather",
          disabled
            ? dark
              ? "border-white-alpha-20 bg-white-alpha-0"
              : "border-black-alpha-20 bg-secondary-skin"
            : error
              ? cx("border-state-error", dark ? "bg-white-alpha-2" : "bg-secondary-skin")
              : dark
                ? "border-secondary-gold bg-white-alpha-2 ui-active:border-secondary-skin"
                : "border-secondary-gold bg-secondary-skin ui-hover:border-black-alpha-50 ui-active:border-primary-leather",
        )}
      >
        {leftIcon ? <Icon name={leftIcon} size={iconSize} /> : null}
        <div className="relative flex min-w-0 flex-1 flex-col-reverse justify-center gap-0.5 px-space-1">
          <input
            id={inputId}
            placeholder=" "
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={message ? messageId : undefined}
            className={cx(
              "peer w-full min-w-0 bg-transparent placeholder:text-transparent focus-visible:outline-none disabled:cursor-not-allowed",
              size === "md" ? "type-ui-sm-regular" : size === "sm" ? "type-ui-xs-regular" : "type-ui-xs-regular ui-desktop:type-ui-sm-regular",
              disabled && (dark ? "text-white-alpha-40" : "text-black-alpha-50"),
            )}
            {...rest}
          />
          <label
            htmlFor={inputId}
            className={cx(
              "pointer-events-none truncate",
              floats
                ? cx(
                    "type-ui-xs-medium",
                    disabled ? "text-input-label-disabled" : "text-input-label",
                    "peer-placeholder-shown:absolute peer-placeholder-shown:inset-x-space-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:type-ui-sm-regular peer-placeholder-shown:text-black-alpha-60",
                  )
                : cx(
                    "absolute inset-x-space-1 top-1/2 -translate-y-1/2 peer-[:not(:placeholder-shown)]:sr-only",
                    size === "md" ? "type-ui-sm-regular" : size === "sm" ? "type-ui-xs-regular" : "type-ui-xs-regular ui-desktop:type-ui-sm-regular",
                    dark ? (disabled ? "text-white-alpha-40" : "text-white-alpha-60") : disabled ? "text-black-alpha-50" : "text-black-alpha-60",
                  ),
            )}
          >
            {label}
          </label>
        </div>
        {rightIcon && !disabled ? (
          onRightIconClick ? (
            <button
              type="button"
              aria-label={rightIconLabel ?? "Clear"}
              onClick={onRightIconClick}
              className="inline-flex cursor-pointer rounded-4"
            >
              <Icon name={rightIcon} size={iconSize} />
            </button>
          ) : (
            <Icon name={rightIcon} size={iconSize} />
          )
        ) : null}
      </div>
      {message ? (
        <InputMessage id={messageId} status={status}>
          {message}
        </InputMessage>
      ) : null}
    </div>
  );
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "placeholder"> & {
  /** Shown as the placeholder at the top left until something is typed, as Figma's 96px Input does. */
  label: ReactNode;
  error?: boolean;
  message?: ReactNode;
};

/**
 * Figma "Input" (SM) stretched to 96px with its label at the top (Modal - Drop a Hint's "Message (Optional)"): the
 * same border, colours and focus ring as Input, for text that runs over several lines.
 */
export function TextArea({ label, error = false, message, className, id, disabled, rows = 3, ...rest }: TextAreaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  return (
    <div className={cx("flex w-full flex-col gap-space-1", className)}>
      <div
        className={cx(
          "ui-transition relative flex min-h-24 rounded-4 border text-primary-leather has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-offset-2 has-[textarea:focus-visible]:outline-primary-leather",
          disabled ? "border-black-alpha-20 bg-secondary-skin" : error ? "border-state-error bg-secondary-skin" : "border-secondary-gold bg-secondary-skin ui-hover:border-black-alpha-50",
        )}
      >
        <textarea
          id={inputId}
          placeholder=" "
          rows={rows}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={message ? messageId : undefined}
          className="peer type-ui-xs-regular w-full min-w-0 resize-none bg-transparent px-space-4 py-[0.6875rem] placeholder:text-transparent focus-visible:outline-none disabled:cursor-not-allowed"
          {...rest}
        />
        <label htmlFor={inputId} className="type-ui-xs-regular pointer-events-none absolute top-[0.6875rem] left-space-4 text-black-alpha-60 peer-[:not(:placeholder-shown)]:sr-only">
          {label}
        </label>
      </div>
      {message ? (
        <InputMessage id={messageId} status="error">
          {message}
        </InputMessage>
      ) : null}
    </div>
  );
}
