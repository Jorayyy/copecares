import { prisma } from "@/lib/prisma";

const SLOT_PATTERN = /^[1-6]$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  const { slot } = await params;

  if (!SLOT_PATTERN.test(slot)) {
    return new Response(null, { status: 404 });
  }

  const setting = await prisma.setting.findUnique({
    where: { key: `clinic_gallery_${slot}` },
    select: { value: true },
  });

  const match = setting?.value
    ? /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(setting.value)
    : null;

  if (!match) {
    return new Response(null, { status: 404 });
  }

  const bytes = Buffer.from(match[2], "base64");

  return new Response(bytes, {
    headers: {
      "Content-Type": match[1],
      "Cache-Control": "no-store",
    },
  });
}
