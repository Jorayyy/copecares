import { SettingsForm } from "./settings-form";
import { LogoUpload } from "@/components/logo-upload";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await prisma.setting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  const logo = settings.find((setting) => setting.key === "clinic_logo");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Clinic profile, branding, schedule, and point-of-sale defaults."
      />
      <LogoUpload hasLogo={Boolean(logo?.value)} />
      <SettingsForm
        settings={settings
          .filter((setting) => setting.key !== "clinic_logo")
          .map((setting) => ({
            id: setting.id,
            key: setting.key,
            value: setting.value,
            group: setting.group,
          }))}
      />
    </div>
  );
}
