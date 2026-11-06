"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { ActionState } from "@/lib/action-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { toDateInput } from "@/lib/format";

type MedicalRecord = {
  id: number;
  petId: number;
  appointmentId: number | null;
  veterinarianId: number | null;
  recordDate: Date;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  weight: string | null;
  temperature: string | null;
  notes: string | null;
  nextVisitDate: Date | null;
};

type VaccinationRow = {
  key: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate: string;
  batchNumber: string;
  notes: string;
};

function toDateTimeInput(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function emptyVaccination(): VaccinationRow {
  return {
    key: Math.random().toString(36).slice(2),
    vaccineName: "",
    vaccinationDate: "",
    nextDueDate: "",
    batchNumber: "",
    notes: "",
  };
}

export function MedicalRecordForm({
  action,
  record,
  pets,
  appointments,
  veterinarians,
  currentUserId,
  defaultPetId,
  defaultAppointmentId,
  defaultRecordDate,
  cancelHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  record?: MedicalRecord;
  pets: { id: number; name: string; category: string; ownerName: string }[];
  appointments?: { id: number; code: string; petId: number | null; petName: string }[];
  veterinarians: { id: number; name: string }[];
  currentUserId: number;
  defaultPetId?: number;
  defaultAppointmentId?: number;
  defaultRecordDate: string;
  cancelHref: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    undefined,
  );

  const [petId, setPetId] = useState(
    String(record?.petId ?? defaultPetId ?? ""),
  );
  const [appointmentId, setAppointmentId] = useState(
    String(record?.appointmentId ?? defaultAppointmentId ?? ""),
  );
  const [vaccinations, setVaccinations] = useState<VaccinationRow[]>([]);

  const selectedAppointments = appointments ?? [];

  function chooseAppointment(value: string) {
    setAppointmentId(value);
    const appointment = selectedAppointments.find(
      (item) => String(item.id) === value,
    );
    if (appointment?.petId) setPetId(String(appointment.petId));
  }

  function updateVaccination(
    key: string,
    field: keyof Omit<VaccinationRow, "key">,
    value: string,
  ) {
    setVaccinations((current) =>
      current.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    );
  }

  const serializedVaccinations = JSON.stringify(
    vaccinations.map((row) => ({
      vaccineName: row.vaccineName,
      vaccinationDate: row.vaccinationDate,
      nextDueDate: row.nextDueDate,
      batchNumber: row.batchNumber,
      notes: row.notes,
    })),
  );

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      {record ? <input type="hidden" name="id" value={record.id} /> : null}
      <input type="hidden" name="vaccinations" value={serializedVaccinations} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="petId">Pet</Label>
          <Select
            id="petId"
            name="petId"
            value={petId}
            onChange={(event) => setPetId(event.target.value)}
            required
          >
            <option value="" disabled>
              Select pet
            </option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} · {pet.category} · {pet.ownerName}
              </option>
            ))}
          </Select>
        </div>

        {record ? (
          <input
            type="hidden"
            name="appointmentId"
            value={record.appointmentId ?? ""}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="appointmentId">Appointment (optional)</Label>
            <Select
              id="appointmentId"
              name="appointmentId"
              value={appointmentId}
              onChange={(event) => chooseAppointment(event.target.value)}
            >
              <option value="">Not linked</option>
              {selectedAppointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.code} · {appointment.petName}
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="recordDate">Record date</Label>
          <Input
            id="recordDate"
            name="recordDate"
            type="datetime-local"
            defaultValue={
              record ? toDateTimeInput(record.recordDate) : defaultRecordDate
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nextVisitDate">Next visit</Label>
          <Input
            id="nextVisitDate"
            name="nextVisitDate"
            type="date"
            defaultValue={
              record?.nextVisitDate ? toDateInput(record.nextVisitDate) : ""
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="veterinarianId">Veterinarian</Label>
          <Select
            id="veterinarianId"
            name="veterinarianId"
            defaultValue={record?.veterinarianId ?? currentUserId}
          >
            {veterinarians.map((vet) => (
              <option key={vet.id} value={vet.id}>
                {vet.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="0.01"
            defaultValue={record?.weight ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            defaultValue={record?.temperature ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Textarea
          id="diagnosis"
          name="diagnosis"
          defaultValue={record?.diagnosis ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="treatment">Treatment</Label>
          <Textarea
            id="treatment"
            name="treatment"
            defaultValue={record?.treatment ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="prescription">Prescription</Label>
          <Textarea
            id="prescription"
            name="prescription"
            defaultValue={record?.prescription ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={record?.notes ?? ""} />
      </div>

      {!record ? (
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <Label>Vaccinations</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setVaccinations((current) => [...current, emptyVaccination()])
              }
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          {vaccinations.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No vaccinations recorded for this visit.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {vaccinations.map((row, index) => (
                <div
                  key={row.key}
                  className="grid gap-3 rounded-lg border border-zinc-200 p-3 sm:grid-cols-2 dark:border-zinc-800"
                >
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Vaccination {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                        onClick={() =>
                          setVaccinations((current) =>
                            current.filter((item) => item.key !== row.key),
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`vaccineName-${row.key}`}>Vaccine</Label>
                    <Input
                      id={`vaccineName-${row.key}`}
                      value={row.vaccineName}
                      onChange={(event) =>
                        updateVaccination(
                          row.key,
                          "vaccineName",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`vaccinationDate-${row.key}`}>Given on</Label>
                    <Input
                      id={`vaccinationDate-${row.key}`}
                      type="date"
                      value={row.vaccinationDate}
                      onChange={(event) =>
                        updateVaccination(
                          row.key,
                          "vaccinationDate",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`nextDueDate-${row.key}`}>Next due</Label>
                    <Input
                      id={`nextDueDate-${row.key}`}
                      type="date"
                      value={row.nextDueDate}
                      onChange={(event) =>
                        updateVaccination(
                          row.key,
                          "nextDueDate",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`batchNumber-${row.key}`}>Batch no.</Label>
                    <Input
                      id={`batchNumber-${row.key}`}
                      value={row.batchNumber}
                      onChange={(event) =>
                        updateVaccination(
                          row.key,
                          "batchNumber",
                          event.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <Label htmlFor={`vaccineNotes-${row.key}`}>Notes</Label>
                    <Input
                      id={`vaccineNotes-${row.key}`}
                      value={row.notes}
                      onChange={(event) =>
                        updateVaccination(row.key, "notes", event.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{record ? "Save changes" : "Create record"}</SubmitButton>
        <Link href={cancelHref} className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
