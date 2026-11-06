import Link from "next/link";

import { Badge, statusTone } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ageLabel, formatDate } from "@/lib/format";

type PetDetailData = {
  id: number;
  name: string;
  breed: string | null;
  gender: string;
  birthDate: Date | null;
  weight: { toString(): string } | null;
  color: string | null;
  medicalNotes: string | null;
  isActive: boolean;
  petCategory: { name: string };
  user: { name: string; email: string; phone: string | null };
  medicalRecords: {
    id: number;
    recordDate: Date;
    diagnosis: string | null;
    treatment: string | null;
    veterinarian: { name: string } | null;
  }[];
  vaccinations: {
    id: number;
    vaccineName: string;
    vaccinationDate: Date;
    nextDueDate: Date | null;
  }[];
  appointments: {
    id: number;
    code: string;
    appointmentDate: Date;
    appointmentTime: string;
    status: string;
    reason: string | null;
  }[];
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-sm text-zinc-900 dark:text-zinc-50">{value}</dd>
    </div>
  );
}

export function PetDetail({
  pet,
  editHref,
  backHref,
}: {
  pet: PetDetailData;
  editHref: string;
  backHref: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {pet.name}
              </h2>
              <Badge tone={pet.isActive ? "success" : "default"}>
                {pet.isActive ? "active" : "inactive"}
              </Badge>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {pet.petCategory.name} · {pet.breed ?? "Unknown breed"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={editHref} className={buttonVariants({ variant: "outline" })}>
              Edit pet
            </Link>
            <Link href={backHref} className={buttonVariants({ variant: "ghost" })}>
              Back
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Owner" value={pet.user.name} />
          <Field label="Contact" value={pet.user.phone ?? pet.user.email} />
          <Field label="Age" value={ageLabel(pet.birthDate)} />
          <Field label="Weight" value={pet.weight ? `${pet.weight.toString()} kg` : "—"} />
          <Field label="Gender" value={pet.gender} />
          <Field label="Color" value={pet.color ?? "—"} />
          <Field label="Born" value={formatDate(pet.birthDate)} />
          <Field label="Records" value={String(pet.medicalRecords.length)} />
        </dl>

        {pet.medicalNotes ? (
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Medical notes</p>
            <p className="text-sm whitespace-pre-line text-zinc-900 dark:text-zinc-50">
              {pet.medicalNotes}
            </p>
          </div>
        ) : null}
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Medical records
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Veterinarian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pet.medicalRecords.length === 0 ? (
              <TableEmpty colSpan={4}>No medical records yet.</TableEmpty>
            ) : (
              pet.medicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.recordDate)}</TableCell>
                  <TableCell>{record.diagnosis ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {record.treatment ?? "—"}
                  </TableCell>
                  <TableCell>{record.veterinarian?.name ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Vaccinations
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vaccine</TableHead>
              <TableHead>Given</TableHead>
              <TableHead>Next due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pet.vaccinations.length === 0 ? (
              <TableEmpty colSpan={3}>No vaccinations recorded.</TableEmpty>
            ) : (
              pet.vaccinations.map((vaccination) => (
                <TableRow key={vaccination.id}>
                  <TableCell>{vaccination.vaccineName}</TableCell>
                  <TableCell>{formatDate(vaccination.vaccinationDate)}</TableCell>
                  <TableCell>{formatDate(vaccination.nextDueDate)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Appointment history
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pet.appointments.length === 0 ? (
              <TableEmpty colSpan={4}>No appointments yet.</TableEmpty>
            ) : (
              pet.appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-mono text-xs">{appointment.code}</TableCell>
                  <TableCell>
                    {formatDate(appointment.appointmentDate)}{" "}
                    {appointment.appointmentTime}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {appointment.reason ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge tone={statusTone(appointment.status)}>
                      {appointment.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
