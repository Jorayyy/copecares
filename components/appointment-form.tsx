"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import type { ActionState } from "@/lib/action-state";
import { APPOINTMENT_STATUSES, appointmentStatusLabel } from "@/lib/clinic";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { toDateInput, todayDateInput } from "@/lib/format";

type OwnerOption = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  pets: {
    id: number;
    name: string;
    breed: string | null;
    petCategoryId: number;
  }[];
};

type ServiceOption = {
  id: number;
  name: string;
  price: string;
  durationMinutes: number;
};

type Appointment = {
  id: number;
  userId: number | null;
  petId: number | null;
  veterinarianId: number | null;
  petCategoryId: number | null;
  ownerName: string | null;
  contact: string | null;
  email: string | null;
  address: string | null;
  petName: string | null;
  petBreed: string | null;
  petAge: string | null;
  appointmentDate: Date;
  appointmentTime: string;
  reason: string | null;
  notes: string | null;
  status: string;
  services: { serviceId: number }[];
};

export function AppointmentForm({
  action,
  appointment,
  owners,
  categories,
  services,
  veterinarians,
  cancelHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  appointment?: Appointment;
  owners: OwnerOption[];
  categories: { id: number; name: string }[];
  services: ServiceOption[];
  veterinarians: { id: number; name: string }[];
  cancelHref: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    undefined,
  );

  const [mode, setMode] = useState<"registered" | "walkin">(
    appointment ? (appointment.userId ? "registered" : "walkin") : "registered",
  );
  const [ownerId, setOwnerId] = useState(
    appointment?.userId ? String(appointment.userId) : "",
  );
  const [petId, setPetId] = useState(
    appointment?.petId ? String(appointment.petId) : "",
  );
  const [categoryId, setCategoryId] = useState(
    appointment?.petCategoryId ? String(appointment.petCategoryId) : "",
  );
  const [selectedServices, setSelectedServices] = useState<number[]>(
    appointment?.services.map((item) => item.serviceId) ?? [],
  );

  const owner = useMemo(
    () => owners.find((item) => String(item.id) === ownerId),
    [ownerId, owners],
  );

  const pets = owner?.pets ?? [];
  const selectedPet = pets.find((pet) => String(pet.id) === petId);
  const selectedTotal = selectedServices.reduce((total, id) => {
    const service = services.find((item) => item.id === id);
    return total + (service ? Number(service.price) : 0);
  }, 0);

  function chooseMode(next: "registered" | "walkin") {
    setMode(next);
    if (next === "walkin") {
      setOwnerId("");
      setPetId("");
    }
  }

  function chooseOwner(value: string) {
    setOwnerId(value);
    setPetId("");
    setCategoryId("");
  }

  function choosePet(value: string) {
    setPetId(value);
    const pet = pets.find((item) => String(item.id) === value);
    if (pet) setCategoryId(String(pet.petCategoryId));
  }

  function toggleService(id: number) {
    setSelectedServices((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      {appointment ? <input type="hidden" name="id" value={appointment.id} /> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => chooseMode("registered")}
          className={buttonVariants({
            variant: mode === "registered" ? "default" : "outline",
            size: "sm",
          })}
        >
          Registered owner
        </button>
        <button
          type="button"
          onClick={() => chooseMode("walkin")}
          className={buttonVariants({
            variant: mode === "walkin" ? "default" : "outline",
            size: "sm",
          })}
        >
          Walk-in
        </button>
      </div>

      {mode === "registered" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="userId">Pet owner</Label>
            <Select
              id="userId"
              name="userId"
              value={ownerId}
              onChange={(event) => chooseOwner(event.target.value)}
              required
            >
              <option value="" disabled>
                Select owner
              </option>
              {owners.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.email})
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="petId">Pet</Label>
            <Select
              id="petId"
              name="petId"
              value={petId}
              onChange={(event) => choosePet(event.target.value)}
              disabled={!owner}
              required
            >
              <option value="" disabled>
                {owner ? "Select pet" : "Select an owner first"}
              </option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                </option>
              ))}
            </Select>
            {owner && pets.length === 0 ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                This owner has no pets yet. Use walk-in or add a pet first.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="ownerName">Owner name</Label>
            <Input
              id="ownerName"
              name="ownerName"
              defaultValue={appointment?.ownerName ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact">Contact number</Label>
            <Input
              id="contact"
              name="contact"
              defaultValue={appointment?.contact ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={appointment?.email ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={appointment?.address ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="petName">Pet name</Label>
            <Input
              id="petName"
              name="petName"
              defaultValue={appointment?.petName ?? ""}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="petBreed">Breed</Label>
            <Input
              id="petBreed"
              name="petBreed"
              defaultValue={appointment?.petBreed ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="petAge">Age</Label>
            <Input
              id="petAge"
              name="petAge"
              defaultValue={appointment?.petAge ?? ""}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="petCategoryId">Pet category</Label>
          <Select
            id="petCategoryId"
            name="petCategoryId"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="veterinarianId">Veterinarian</Label>
          <Select
            id="veterinarianId"
            name="veterinarianId"
            defaultValue={appointment?.veterinarianId ?? ""}
          >
            <option value="">Unassigned</option>
            {veterinarians.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointmentDate">Date</Label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            defaultValue={
              appointment
                ? toDateInput(appointment.appointmentDate)
                : todayDateInput()
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="appointmentTime">Time</Label>
          <Input
            id="appointmentTime"
            name="appointmentTime"
            type="time"
            defaultValue={appointment?.appointmentTime ?? "09:00"}
            required
          />
        </div>
        {appointment ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={appointment.status}>
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {appointmentStatusLabel(status)}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
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
                className="mt-0.5 size-4 rounded border-zinc-300 text-emerald-600"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="reason">Reason for visit</Label>
          <Textarea
            id="reason"
            name="reason"
            defaultValue={appointment?.reason ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Internal notes</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={appointment?.notes ?? ""}
          />
        </div>
      </div>

      {selectedPet ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Booking for {selectedPet.name}.
        </p>
      ) : null}

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{appointment ? "Save appointment" : "Create appointment"}</SubmitButton>
        <Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
