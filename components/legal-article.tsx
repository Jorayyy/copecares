import { Mail, Phone } from "lucide-react";

import type { ClinicProfile } from "@/lib/clinic-profile";
import type { LegalDocument } from "@/lib/legal-copy";

export function LegalArticle({
  document,
  updated,
  contactTitle,
  contactBody,
  profile,
}: {
  document: LegalDocument;
  updated: string;
  contactTitle: string;
  contactBody: string;
  profile: ClinicProfile;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sunset-700 dark:text-sunset-400">
        {document.eyebrow}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        {document.title}
      </h1>
      <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
        {document.intro}
      </p>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{updated}</p>

      <div className="mt-8 flex flex-col gap-8">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              {section.heading}
            </h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
              >
                {paragraph}
              </p>
            ))}
            {section.list ? (
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <h2 className="font-serif text-xl font-semibold tracking-tight">
          {contactTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {contactBody}
        </p>
        <div className="mt-3 flex flex-col gap-1.5 text-sm">
          <p className="font-medium">{profile.clinicName}</p>
          <p className="text-zinc-600 dark:text-zinc-400">{profile.address}</p>
          {profile.phone ? (
            <a
              href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-1.5 text-dusk-700 hover:underline dark:text-dusk-300"
            >
              <Phone className="size-4" />
              {profile.phone}
            </a>
          ) : null}
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 text-dusk-700 hover:underline dark:text-dusk-300"
            >
              <Mail className="size-4" />
              {profile.email}
            </a>
          ) : null}
        </div>
      </section>
    </article>
  );
}
