export type PreviewState = "hover" | "pressed" | "active" | "focus";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
