"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";

import type { Locale } from "@/lib/locale";
import { Button } from "@/components/ui/button";

const COOKIE = "copecares_locale";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const next: Locale = locale === "en" ? "fil" : "en";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={
        locale === "en" ? "Switch to Filipino" : "Switch to English"
      }
      onClick={() => {
        document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = next === "fil" ? "fil" : "en";
        router.refresh();
      }}
    >
      <Languages className="size-4" />
      {locale === "en" ? "Filipino" : "English"}
    </Button>
  );
}
