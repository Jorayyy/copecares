import type { Metadata } from "next";

import { RegisterForm } from "./register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authCopy } from "@/lib/auth-copy";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Create account | CopeCares",
};

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = authCopy[locale];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">{t.registerTitle}</CardTitle>
        <CardDescription>{t.registerDesc}</CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm
          labels={{
            name: t.name,
            namePlaceholder: t.namePlaceholder,
            email: t.email,
            emailPlaceholder: t.emailPlaceholder,
            phone: t.phone,
            phonePlaceholder: t.phonePlaceholder,
            phoneHint: t.phoneHint,
            password: t.password,
            passwordHint: t.passwordHint,
            confirmPassword: t.confirmPassword,
            showPassword: t.showPassword,
            hidePassword: t.hidePassword,
            consentStart: t.consentStart,
            consentJoin: t.consentJoin,
            consentEnd: t.consentEnd,
            privacy: t.privacy,
            terms: t.terms,
            submit: t.registerSubmit,
            submitting: t.registerSubmitting,
          }}
        />

        <p className="mt-4 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t.staffNote}
        </p>
      </CardContent>
    </Card>
  );
}
