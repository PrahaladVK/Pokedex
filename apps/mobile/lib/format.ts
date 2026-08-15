export function humanize(slug: string | undefined): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => (word.length ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function formatDexNumber(n: number): string {
  return `#${String(n).padStart(4, "0")}`;
}
