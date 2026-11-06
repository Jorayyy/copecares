import { SettingsForm } from "./settings-form";
import { GalleryUpload } from "@/components/gallery-upload";
import { LogoUpload } from "@/components/logo-upload";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Settings" };

const GALLERY_SLOTS = 6;

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await prisma.setting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  const logo = settings.find((setting) => setting.key === "clinic_logo");

  const galleryKeys = new Set(
    settings
      .filter(
        (setting) =>
          setting.key.startsWith("clinic_gallery_") && setting.value,
      )
      .map((setting) => setting.key),
  );

  const gallerySlots = Array.from({ length: GALLERY_SLOTS }, (_, index) => ({
    slot: index + 1,
    hasImage: galleryKeys.has(`clinic_gallery_${index + 1}`),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Clinic profile, branding, schedule, and point-of-sale defaults."
      />
      <LogoUpload hasLogo={Boolean(logo?.value)} />
      <GalleryUpload slots={gallerySlots} />
      <SettingsForm
        settings={settings
          .filter(
            (setting) =>
              setting.key !== "clinic_logo" &&
              !setting.key.startsWith("clinic_gallery_"),
          )
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
