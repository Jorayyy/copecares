"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "copecares-theme";
const CHANGE_EVENT = "copecares-theme";
const ORDER: Theme[] = ["light", "dark", "system"];

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return stored && ORDER.includes(stored) ? stored : "light";
}

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  const dark = theme === "dark" || (theme === "system" && prefersDark());

  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      return;
    }
  }
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => {
    applyTheme(getTheme(), false);
    callback();
  };

  window.addEventListener("storage", sync);
  window.addEventListener(CHANGE_EVENT, sync);
  media.addEventListener("change", sync);

  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener(CHANGE_EVENT, sync);
    media.removeEventListener("change", sync);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, getTheme, () => "light");

  useEffect(() => {
    applyTheme(getTheme(), false);
  }, []);

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const Icon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Theme is ${theme}. Switch to ${next}.`}
      title={`Theme: ${theme} (click for ${next})`}
      onClick={() => {
        applyTheme(next);
        window.dispatchEvent(new Event(CHANGE_EVENT));
      }}
    >
      <Icon className="size-4" />
    </Button>
  );
}
