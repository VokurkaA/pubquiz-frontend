import { en } from "./dictionaries/en";
import { cs } from "./dictionaries/cs";
import type { Dictionary } from "./types";

export const SUPPORTED_LOCALES = ["en", "cs"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const dictionaries = {
  en,
  cs,
};

export type { Dictionary };

export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator as Navigator & { userLanguage?: string };
  const raw = nav.language || nav.userLanguage || "en";
  const base = raw.toLowerCase().split("-")[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(base) ? (base as Locale) : "en";
}
