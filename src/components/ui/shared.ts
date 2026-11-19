export type PreviewState = "hover" | "pressed" | "active" | "focus";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Prefixes a public file path with the GitHub Pages base path. next/image and plain URLs need it; next/link adds it itself. */
export function withBasePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
