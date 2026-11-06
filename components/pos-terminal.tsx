"use client";

import { useActionState, useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import type { ActionState } from "@/lib/action-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_METHODS, paymentMethodLabel } from "@/lib/clinic";
import { formatPeso } from "@/lib/format";
import { cn } from "@/lib/utils";

type ProductOption = {
  id: number;
  name: string;
  price: string;
  stockQuantity: number;
  category: string;
};

type ServiceOption = {
  id: number;
  name: string;
  price: string;
  durationMinutes: number;
};

type OwnerOption = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
};

type AppointmentOption = {
  id: number;
  code: string;
  petName: string;
  ownerName: string;
  userId: number | null;
};

type CartLine = {
  key: string;
  itemType: "product" | "service";
  itemId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  maxQuantity: number;
  discount: number;
};

export function PosTerminal({
  action,
  products,
  services,
  owners,
  appointments,
  defaultAppointmentId,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  products: ProductOption[];
  services: ServiceOption[];
  owners: OwnerOption[];
  appointments: AppointmentOption[];
  defaultAppointmentId?: number;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    undefined,
  );

  const [tab, setTab] = useState<"products" | "services">("products");
  const [productSearch, setProductSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [appointmentId, setAppointmentId] = useState(
    defaultAppointmentId ? String(defaultAppointmentId) : "",
  );
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [taxAmount, setTaxAmount] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );
  }, [productSearch, products]);

  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    if (!query) return services;
    return services.filter((service) =>
      service.name.toLowerCase().includes(query),
    );
  }, [serviceSearch, services]);

  const subtotal = cart.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity - line.discount,
    0,
  );
  const tax = Number(taxAmount) || 0;
  const discount = Number(discountAmount) || 0;
  const total = Math.max(0, subtotal + tax - discount);
  const paid = Number(amountPaid) || 0;
  const change = Math.max(0, paid - total);
  const canSubmit = cart.length > 0 && paid >= total;

  function addProduct(product: ProductOption) {
    addLine(
      "product",
      product.id,
      product.name,
      Number(product.price),
      product.stockQuantity,
    );
  }

  function addService(service: ServiceOption) {
    addLine(
      "service",
      service.id,
      service.name,
      Number(service.price),
      999,
    );
  }

  function addLine(
    itemType: "product" | "service",
    itemId: number,
    name: string,
    unitPrice: number,
    maxQuantity: number,
  ) {
    if (maxQuantity <= 0) return;

    setCart((current) => {
      const existing = current.find(
        (line) => line.itemType === itemType && line.itemId === itemId,
      );
      if (existing) {
        if (existing.quantity >= existing.maxQuantity) return current;
        return current.map((line) =>
          line.key === existing.key
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [
        ...current,
        {
          key: `${itemType}-${itemId}`,
          itemType,
          itemId,
          name,
          unitPrice,
          quantity: 1,
          maxQuantity,
          discount: 0,
        },
      ];
    });
  }

  function changeQuantity(key: string, delta: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.key === key
            ? {
                ...line,
                quantity: Math.min(
                  line.maxQuantity,
                  Math.max(0, line.quantity + delta),
                ),
              }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function removeLine(key: string) {
    setCart((current) => current.filter((line) => line.key !== key));
  }

  function chooseAppointment(value: string) {
    setAppointmentId(value);
    const appointment = appointments.find((item) => String(item.id) === value);
    if (appointment?.userId) setCustomerId(String(appointment.userId));
  }

  const serializedItems = JSON.stringify(
    cart.map((line) => ({
      itemType: line.itemType,
      itemId: line.itemId,
      quantity: line.quantity,
      discount: line.discount,
    })),
  );

  return (
    <form action={formAction} className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <input type="hidden" name="items" value={serializedItems} />

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={tab === "products" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("products")}
          >
            Products
          </Button>
          <Button
            type="button"
            variant={tab === "services" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("services")}
          >
            Services
          </Button>
        </div>

        {tab === "products" ? (
          <>
            <Input
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search products"
            />
            {filteredProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No products available.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const outOfStock = product.stockQuantity <= 0;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      disabled={outOfStock}
                      className="text-left disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Card className="h-full transition-colors hover:border-dusk-400">
                        <CardContent className="flex flex-col gap-1 p-4">
                          <span className="text-sm font-medium">
                            {product.name}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {product.category}
                          </span>
                          <span className="mt-1 font-semibold text-dusk-700 dark:text-dusk-400">
                            {formatPeso(product.price)}
                          </span>
                          <Badge
                            tone={outOfStock ? "danger" : "default"}
                            className="mt-1 w-fit"
                          >
                            Stock: {product.stockQuantity}
                          </Badge>
                        </CardContent>
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <Input
              value={serviceSearch}
              onChange={(event) => setServiceSearch(event.target.value)}
              placeholder="Search services"
            />
            {filteredServices.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No services available.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => addService(service)}
                    className="text-left"
                  >
                    <Card className="h-full transition-colors hover:border-dusk-400">
                      <CardContent className="flex flex-col gap-1 p-4">
                        <span className="text-sm font-medium">{service.name}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {service.durationMinutes} min
                        </span>
                        <span className="mt-1 font-semibold text-dusk-700 dark:text-dusk-400">
                          {formatPeso(service.price)}
                        </span>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Card className="h-fit lg:sticky lg:top-4">
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingCart className="size-4" />
            Current sale
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="customerId">Customer</Label>
            <Select
              id="customerId"
              name="userId"
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
            >
              <option value="">Walk-in customer</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </Select>
          </div>

          {!customerId ? (
            <div className="grid gap-2">
              <Input
                name="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Customer name"
              />
              <Input
                name="customerContact"
                value={customerContact}
                onChange={(event) => setCustomerContact(event.target.value)}
                placeholder="Contact number"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="appointmentId">Appointment (optional)</Label>
            <Select
              id="appointmentId"
              name="appointmentId"
              value={appointmentId}
              onChange={(event) => chooseAppointment(event.target.value)}
            >
              <option value="">Not linked</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.code} · {appointment.petName}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No items in cart.
              </p>
            ) : (
              cart.map((line) => (
                <div
                  key={line.key}
                  className="flex flex-col gap-1 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{line.name}</span>
                    <button
                      type="button"
                      onClick={() => removeLine(line.key)}
                      className="text-red-600 dark:text-red-400"
                      aria-label={`Remove ${line.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="size-7 p-0"
                        onClick={() => changeQuantity(line.key, -1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {line.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="size-7 p-0"
                        onClick={() => changeQuantity(line.key, 1)}
                        disabled={line.quantity >= line.maxQuantity}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPeso(line.unitPrice * line.quantity - line.discount)}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatPeso(line.unitPrice)} each
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPeso(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="taxAmount" className="font-normal">
                Tax
              </Label>
              <Input
                id="taxAmount"
                name="taxAmount"
                type="number"
                min="0"
                step="0.01"
                value={taxAmount}
                onChange={(event) => setTaxAmount(event.target.value)}
                className="h-8 w-28 text-right"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="discountAmount" className="font-normal">
                Discount
              </Label>
              <Input
                id="discountAmount"
                name="discountAmount"
                type="number"
                min="0"
                step="0.01"
                value={discountAmount}
                onChange={(event) => setDiscountAmount(event.target.value)}
                className="h-8 w-28 text-right"
              />
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPeso(total)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <Label htmlFor="paymentMethod">Payment method</Label>
            <Select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {paymentMethodLabel(method)}
                </option>
              ))}
            </Select>
            <Label htmlFor="amountPaid">Amount paid</Label>
            <Input
              id="amountPaid"
              name="amountPaid"
              type="number"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(event) => setAmountPaid(event.target.value)}
              placeholder="0.00"
            />
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Change</span>
              <span>{formatPeso(change)}</span>
            </div>
          </div>

          <Textarea
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notes (optional)"
            className="min-h-16"
          />

          <FormError message={state?.error} />

          <SubmitButton
            className={cn("w-full", !canSubmit && "opacity-50")}
            disabled={!canSubmit}
          >
            Complete sale
          </SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
