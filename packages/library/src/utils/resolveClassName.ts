export default function resolveClassName(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(" ").trim();
}
