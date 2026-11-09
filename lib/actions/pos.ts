"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { isPaymentMethod } from "@/lib/clinic";
import { nextInvoiceNumber } from "@/lib/codes";
import { errorMessage, formValue } from "@/lib/form-utils";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

type CartItem = {
  itemType: "product" | "service";
  itemId: number;
  quantity: number;
  discount: number;
};

function optionalId(formData: FormData, key: string) {
  const value = formValue(formData, key);
  if (!value) return undefined;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function optionalNumber(formData: FormData, key: string) {
  const value = formValue(formData, key);
  if (!value) return 0;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : Number.NaN;
}

function readItems(formData: FormData): CartItem[] | { error: string } {
  const raw = formValue(formData, "items");
  if (!raw) return { error: "Add at least one item to the sale." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "The cart could not be read. Please try again." };
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { error: "Add at least one item to the sale." };
  }

  const items: CartItem[] = [];

  for (const entry of parsed) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;

    const itemType =
      item.itemType === "product" || item.itemType === "service"
        ? item.itemType
        : null;
    const itemId = Number(item.itemId);
    const quantity = Number(item.quantity);
    const discount = Number(item.discount ?? 0);

    if (!itemType) return { error: "One or more cart items are invalid." };
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return { error: "One or more cart items are invalid." };
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { error: "Item quantities must be whole numbers." };
    }
    if (!Number.isFinite(discount) || discount < 0) {
      return { error: "Item discounts cannot be negative." };
    }

    items.push({ itemType, itemId, quantity, discount });
  }

  if (items.length === 0) return { error: "Add at least one item to the sale." };

  return items;
}

export async function completeSale(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();

  const items = readItems(formData);
  if ("error" in items) return { error: items.error };

  const paymentMethod = formValue(formData, "paymentMethod");
  if (!isPaymentMethod(paymentMethod)) {
    return { error: "Choose a valid payment method." };
  }

  const taxAmount = optionalNumber(formData, "taxAmount");
  const discountAmount = optionalNumber(formData, "discountAmount");
  const amountPaid = optionalNumber(formData, "amountPaid");

  if (
    !Number.isFinite(taxAmount) ||
    !Number.isFinite(discountAmount) ||
    !Number.isFinite(amountPaid)
  ) {
    return { error: "Amounts must be valid positive numbers." };
  }

  const productIds = items
    .filter((item) => item.itemType === "product")
    .map((item) => item.itemId);
  const serviceIds = items
    .filter((item) => item.itemType === "service")
    .map((item) => item.itemId);

  const [products, services] = await Promise.all([
    productIds.length > 0
      ? prisma.product.findMany({
          where: { id: { in: productIds }, deletedAt: null, isActive: true },
          select: { id: true, name: true, sellingPrice: true, stockQuantity: true },
        })
      : Promise.resolve([]),
    serviceIds.length > 0
      ? prisma.service.findMany({
          where: { id: { in: serviceIds }, deletedAt: null, isActive: true },
          select: { id: true, name: true, price: true },
        })
      : Promise.resolve([]),
  ]);

  const productMap = new Map(products.map((product) => [product.id, product]));
  const serviceMap = new Map(services.map((service) => [service.id, service]));

  let rows: {
    itemType: "product" | "service";
    itemId: number;
    itemName: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    totalPrice: number;
  }[];

  try {
    rows = items.map((item) => {
      const product =
        item.itemType === "product" ? productMap.get(item.itemId) : undefined;
      const service =
        item.itemType === "service" ? serviceMap.get(item.itemId) : undefined;

      if (item.itemType === "product" && !product) {
        throw new Error("One or more products are unavailable.");
      }
      if (item.itemType === "service" && !service) {
        throw new Error("One or more services are unavailable.");
      }
      if (product && product.stockQuantity < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}.`);
      }

      const unitPrice = Number(product?.sellingPrice ?? service?.price ?? 0);
      const totalPrice = unitPrice * item.quantity - item.discount;

      if (totalPrice < 0) {
        throw new Error("An item discount is larger than its price.");
      }

      return {
        itemType: item.itemType,
        itemId: item.itemId,
        itemName: product?.name ?? service?.name ?? "",
        unitPrice,
        quantity: item.quantity,
        discount: item.discount,
        totalPrice,
      };
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  const subtotal = rows.reduce((sum, row) => sum + row.totalPrice, 0);
  const totalAmount = subtotal + taxAmount - discountAmount;

  if (totalAmount < 0) {
    return { error: "The total cannot be negative." };
  }
  if (amountPaid < totalAmount) {
    return { error: "Amount paid is less than the total." };
  }

  const changeAmount = amountPaid - totalAmount;
  const userId = optionalId(formData, "userId");
  const appointmentId = optionalId(formData, "appointmentId");

  if (userId) {
    const customer = await prisma.user.findFirst({
      where: { id: userId, isActive: true },
      select: { id: true },
    });
    if (!customer) return { error: "Customer not found." };
  }

  if (appointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, deletedAt: null },
      select: { id: true },
    });
    if (!appointment) return { error: "Appointment not found." };
  }

  let saleId = 0;

  try {
    const invoiceNumber = await nextInvoiceNumber();

    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          userId: userId ?? null,
          cashierId: user.id,
          appointmentId: appointmentId ?? null,
          customerName: formValue(formData, "customerName") || null,
          customerContact: formValue(formData, "customerContact") || null,
          subtotal,
          taxAmount,
          discountAmount,
          totalAmount,
          amountPaid,
          changeAmount,
          paymentMethod,
          status: "completed",
          notes: formValue(formData, "notes") || null,
        },
      });

      saleId = sale.id;

      await tx.saleItem.createMany({
        data: rows.map((row) => ({
          saleId: sale.id,
          itemType: row.itemType,
          productId: row.itemType === "product" ? row.itemId : null,
          serviceId: row.itemType === "service" ? row.itemId : null,
          itemName: row.itemName,
          unitPrice: row.unitPrice,
          quantity: row.quantity,
          discount: row.discount,
          totalPrice: row.totalPrice,
        })),
      });

      for (const row of rows) {
        if (row.itemType !== "product") continue;
        await tx.product.update({
          where: { id: row.itemId },
          data: { stockQuantity: { decrement: row.quantity } },
        });
      }

      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: "completed" },
        });
      }
    });
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath("/admin/pos");
  revalidatePath("/admin/pos/sales");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  if (appointmentId) revalidatePath(`/admin/appointments/${appointmentId}`);
  redirect(`/admin/pos/sales/${saleId}`);
}
