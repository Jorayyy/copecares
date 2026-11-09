import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

import { LoginForm } from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authCopy } from "@/lib/auth-copy";
import { getClinicProfile } from "@/lib/clinic-profile";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Sign in | CopeCares",
};

const DEMO_ACCOUNTS = [
  "admin@copecares.com / admin123",
  "vet@copecares.com / vet123",
  "staff@copecares.com / staff123",
  "owner@test.com / owner123",
];

export default async function LoginPage() {
  const [locale, profile] = await Promise.all([
    getLocale(),
    getClinicProfile(),
  ]);
  const t = authCopy[locale];
  const showDemo = process.env.NODE_ENV !== "production";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">{t.loginTitle}</CardTitle>
        <CardDescription>{t.loginDesc}</CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm
          labels={{
            email: t.email,
            emailPlaceholder: t.emailPlaceholder,
            password: t.password,
            passwordPlaceholder: t.passwordPlaceholder,
            showPassword: t.showPassword,
            hidePassword: t.hidePassword,
            submit: t.submit,
            submitting: t.submitting,
          }}
        />

        <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t.newOwner}{" "}
          <Link
            href="/register"
            className="font-medium text-dusk-700 hover:underline dark:text-dusk-400"
          >
            {t.createAccount}
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <p className="text-sm font-medium">{t.helpTitle}</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {t.helpBody}
          </p>
          <div className="mt-2 flex flex-col gap-1 text-xs">
            {profile.phone ? (
              <a
                href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 text-dusk-700 hover:underline dark:text-dusk-300"
              >
                <Phone className="size-3.5" />
                {profile.phone}
              </a>
            ) : null}
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 text-dusk-700 hover:underline dark:text-dusk-300"
              >
                <Mail className="size-3.5" />
                {profile.email}
              </a>
            ) : null}
          </div>
        </div>

        {showDemo ? (
          <div className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              {t.demoTitle}
            </p>
            <p className="mt-1">{t.demoNote}</p>
            <ul className="mt-2 flex flex-col gap-0.5 font-mono text-[11px]">
              {DEMO_ACCOUNTS.map((account) => (
                <li key={account}>{account}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-4 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.agreePrefix}{" "}
          <Link href="/privacy" className="underline hover:text-zinc-900 dark:hover:text-zinc-50">
            {t.privacy}
          </Link>{" "}
          {t.and}{" "}
          <Link href="/terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-50">
            {t.terms}
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}
