import { prisma } from "@/lib/prisma";

function dateStamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

export async function nextAppointmentCode() {
  const prefix = `APT-${dateStamp()}-`;
  const count = await prisma.appointment.count({
    where: { code: { startsWith: prefix } },
  });

  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}

export async function nextInvoiceNumber() {
  const prefix = `INV-${dateStamp()}-`;
  const count = await prisma.sale.count({
    where: { invoiceNumber: { startsWith: prefix } },
  });

  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}
