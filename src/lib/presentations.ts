import raw from "../data/presentations.json";
import type { Presentation } from "./types";

const all = raw as Presentation[];

export function getAll(): Presentation[] {
  return [...all].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBySlug(slug: string): Presentation | undefined {
  return all.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  if (!iso) return "Date pending";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function shortDate(iso: string): string {
  if (!iso) return "TBD";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function presenterInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
