import type { Metadata } from "next";

import { LegalArticle } from "@/components/legal-article";
import { getClinicProfile } from "@/lib/clinic-profile";
import { legalCopy } from "@/lib/legal-copy";
import { getLocale } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Privacy Notice | CopeCares",
};

export default async function PrivacyPage() {
  const [locale, profile] = await Promise.all([
    getLocale(),
    getClinicProfile(),
  ]);
  const t = legalCopy[locale];

  return (
    <LegalArticle
      document={t.privacy}
      updated={t.updated}
      contactTitle={t.contactTitle}
      contactBody={t.contactBody}
      profile={profile}
    />
  );
}
