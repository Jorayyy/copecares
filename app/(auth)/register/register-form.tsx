"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

import { registerAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterLabels = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  phoneHint: string;
  password: string;
  passwordHint: string;
  confirmPassword: string;
  showPassword: string;
  hidePassword: string;
  consentStart: string;
  consentJoin: string;
  consentEnd: string;
  privacy: string;
  terms: string;
  submit: string;
  submitting: string;
};

export function RegisterForm({ labels }: { labels: RegisterLabels }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    registerAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">{labels.name}</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder={labels.namePlaceholder}
          autoFocus
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{labels.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">{labels.phone}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={labels.phonePlaceholder}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {labels.phoneHint}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{labels.password}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={labels.passwordHint}
            className="pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={
              showPassword ? labels.hidePassword : labels.showPassword
            }
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-4 focus-visible:ring-dusk-500/20 focus-visible:outline-none dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {labels.passwordHint}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">{labels.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
        />
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 accent-dusk-600"
        />
        <label
          htmlFor="consent"
          className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          {labels.consentStart}
          <Link
            href="/privacy"
            className="font-medium text-dusk-700 underline dark:text-dusk-300"
          >
            {labels.privacy}
          </Link>
          {labels.consentJoin}
          <Link
            href="/terms"
            className="font-medium text-dusk-700 underline dark:text-dusk-300"
          >
            {labels.terms}
          </Link>
          {labels.consentEnd}
        </label>
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? labels.submitting : labels.submit}
      </Button>
    </form>
  );
}
