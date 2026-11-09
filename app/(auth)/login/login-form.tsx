"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

import { loginAction, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginLabels = {
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  submitting: string;
};

export function LoginForm({
  labels,
  callbackUrl,
}: {
  labels: LoginLabels;
  callbackUrl?: string;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    loginAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{labels.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={labels.emailPlaceholder}
          autoFocus
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{labels.password}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={labels.passwordPlaceholder}
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
