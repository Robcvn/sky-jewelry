import { ButtonLink } from "./Button";
import { Icon, type IconName } from "./Icon";

type DyoCardProps = {
  icon: IconName;
  title: string;
  body: string;
  cta: { label: string; href: string };
};

/** Figma "DYO Card" (Design Your Own): a 64px icon, caps title, body and a button, centred. */
export function DyoCard({ icon, title, body, cta }: DyoCardProps) {
  return (
    <div className="flex flex-col items-center gap-space-6 text-center text-primary-leather">
      <div className="flex flex-col items-center gap-space-6">
        <Icon name={icon} size={64} />
        <div className="flex flex-col gap-space-4">
          <h3 className="type-heading-caps-xl">{title}</h3>
          <p className="type-body-md-regular px-space-6">{body}</p>
        </div>
      </div>
      <ButtonLink href={cta.href} variant="secondary" size="md">
        {cta.label}
      </ButtonLink>
    </div>
  );
}
