"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { ActionState } from "@/lib/action-state";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { todayDateInput } from "@/lib/format";

type PetOption = {
  id: number;
  name: string;
  breed: string | null;
};

type ServiceOption = {
  id: number;
  name: string;
  price: string;
  durationMinutes: number;
};

export function OwnAppointmentForm({
  action,
  pets,
  services,
  cancelHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  pets: PetOption[];
  services: ServiceOption[];
  cancelHref: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    undefined,
  );
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const selectedTotal = selectedServices.reduce((total, id) => {
    const service = services.find((item) => item.id === id);
    return total + (service ? Number(service.price) : 0);
  }, 0);

  function toggleService(id: number) {
    setSelectedServices((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="petId">Pet</Label>
        <Select id="petId" name="petId" required defaultValue="">
          <option value="" disabled>
            Select a pet
          </option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointmentDate">Date</Label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            defaultValue={todayDateInput()}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointmentTime">Time</Label>
          <Input
            id="appointmentTime"
            name="appointmentTime"
            type="time"
            defaultValue="09:00"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Services</Label>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Total: ₱{selectedTotal.toFixed(2)}
          </span>
        </div>
        <div className="grid gap-2 rounded-lg border border-zinc-200 p-3 sm:grid-cols-2 dark:border-zinc-800">
          {services.map((service) => (
            <label
              key={service.id}
              className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <input
                type="checkbox"
                name="services"
                value={service.id}
                checked={selectedServices.includes(service.id)}
                onChange={() => toggleService(service.id)}
                className="mt-0.5 size-4 rounded border-zinc-300 text-dusk-600"
              />
              <span>
                {service.name}
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                  ₱{Number(service.price).toFixed(2)} · {service.durationMinutes} min
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reason">Reason for visit</Label>
        <Textarea id="reason" name="reason" />
      </div>

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>Book appointment</SubmitButton>
        <Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
