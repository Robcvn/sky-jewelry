import { Icon, type IconName } from "./Icon";
import { cx } from "./shared";

type IconBlockProps = {
  icon: IconName;
  /** The label; `lines` breaks it in two on desktop, as Figma does. */
  label: string;
  lines?: [string, string];
  className?: string;
};

/**
 * Figma "Icon Block", Type=Default (Size MD on desktop, SM on mobile): a 48px icon over a short centred label.
 * Desktop label ui-xs-medium (12/16); mobile ui-2xs-medium (10/14), as the PDP icon row overrides it.
 */
export function IconBlock({ icon, label, lines, className }: IconBlockProps) {
  return (
    <div className={cx("flex flex-1 flex-col items-center gap-space-2 text-center text-primary-leather", className)}>
      <Icon name={icon} size={48} />
      <p className="type-ui-2xs-medium ui-desktop:type-ui-xs-medium">
        {lines ? (
          <>
            <span className="ui-desktop:block">{lines[0]}</span> <span className="ui-desktop:block">{lines[1]}</span>
          </>
        ) : (
          label
        )}
      </p>
    </div>
  );
}
