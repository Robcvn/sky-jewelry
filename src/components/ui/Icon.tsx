import type { CSSProperties, SVGProps } from "react";
import { iconData, type IconName } from "@/icons/icon-data";

export type { IconName };

type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "name"> & {
  name: IconName;
  /** Rendered width and height in px. */
  size?: number;
  /** Accessible name. Leave empty when the icon is decorative. */
  label?: string;
  /** Fill for multi-tone icons such as gemstone-color. */
  accentColor?: string;
};

export function Icon({ name, size = 24, label, accentColor, style, ...rest }: IconProps) {
  const icon = iconData[name];
  const iconStyle = accentColor
    ? ({ ...style, "--icon-accent": accentColor } as CSSProperties)
    : style;

  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      style={iconStyle}
      {...rest}
      className={["shrink-0", rest.className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
