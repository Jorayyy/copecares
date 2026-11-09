import { cookies } from "next/headers";

export type Locale = "en" | "fil";

export const LOCALE_COOKIE = "copecares_locale";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "fil";
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : "en";
}
