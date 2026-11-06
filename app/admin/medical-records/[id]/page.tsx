import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import {
  addVaccination,
  deleteMedicalRecord,
  deleteVaccination,
} from "@/lib/actions/medical-records";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ageLabel, formatDate, formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function MedicalRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const recordId = Number(id);

  if (!Number.isInteger(recordId) || recordId <= 0) notFound();

  const record = await prisma.medicalRecord.findFirst({
    where: { id: recordId, deletedAt: null },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          breed: true,
          birthDate: true,
          petCategory: { select: { name: true } },
          user: { select: { name: true, email: true, phone: true } },
        },
      },
      veterinarian: { select: { name: true } },
      appointment: { select: { id: true, code: true } },
      vaccinations: { orderBy: { vaccinationDate: "desc" } },
    },
  });

  if (!record) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Medical record #${record.id}`}
        description={`${record.pet.name} · ${formatDateTime(record.recordDate)}`}
        actions={
          <>
            <Link
              href={`/admin/medical-records/${record.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
            <form action={deleteMedicalRecord}>
              <input type="hidden" name="id" value={record.id} />
              <DeleteButton label="Delete" small={false} />
            </form>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visit information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Detail label="Pet">
              <Link
                href={`/admin/pets/${record.pet.id}`}
                className="hover:underline"
              >
                {record.pet.name}
              </Link>
            </Detail>
            <Detail label="Category">{record.pet.petCategory.name}</Detail>
            <Detail label="Breed">{record.pet.breed ?? "—"}</Detail>
            <Detail label="Age">{ageLabel(record.pet.birthDate)}</Detail>
            <Detail label="Owner">{record.pet.user.name}</Detail>
            <Detail label="Contact">
              {record.pet.user.phone ?? record.pet.user.email}
            </Detail>
            <Detail label="Veterinarian">
              {record.veterinarian?.name ?? "—"}
            </Detail>
            <Detail label="Appointment">
              {record.appointment ? (
                <Link
                  href={`/admin/appointments/${record.appointment.id}`}
                  className="hover:underline"
                >
                  {record.appointment.code}
                </Link>
              ) : (
                "—"
              )}
            </Detail>
            <Detail label="Record date">
              {formatDateTime(record.recordDate)}
            </Detail>
            <Detail label="Next visit">
              {record.nextVisitDate ? formatDate(record.nextVisitDate) : "—"}
            </Detail>
            <Detail label="Weight">
              {record.weight ? `${record.weight.toString()} kg` : "—"}
            </Detail>
            <Detail label="Temperature">
              {record.temperature ? `${record.temperature.toString()} °C` : "—"}
            </Detail>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical notes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <Detail label="Diagnosis">{record.diagnosis ?? "—"}</Detail>
            <Detail label="Treatment">{record.treatment ?? "—"}</Detail>
            <Detail label="Prescription">{record.prescription ?? "—"}</Detail>
            <Detail label="Notes">{record.notes ?? "—"}</Detail>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vaccinations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaccine</TableHead>
                <TableHead>Given on</TableHead>
                <TableHead>Next due</TableHead>
                <TableHead>Batch no.</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.vaccinations.length === 0 ? (
                <TableEmpty colSpan={6}>No vaccinations recorded.</TableEmpty>
              ) : (
                record.vaccinations.map((vaccination) => (
                  <TableRow key={vaccination.id}>
                    <TableCell className="font-medium">
                      {vaccination.vaccineName}
                    </TableCell>
                    <TableCell>
                      {formatDate(vaccination.vaccinationDate)}
                    </TableCell>
                    <TableCell>
                      {vaccination.nextDueDate
                        ? formatDate(vaccination.nextDueDate)
                        : "—"}
                    </TableCell>
                    <TableCell>{vaccination.batchNumber ?? "—"}</TableCell>
                    <TableCell className="max-w-56 truncate">
                      {vaccination.notes ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <form action={deleteVaccination}>
                          <input type="hidden" name="id" value={vaccination.id} />
                          <input
                            type="hidden"
                            name="medicalRecordId"
                            value={record.id}
                          />
                          <DeleteButton message="Remove this vaccination?" />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <form
            action={addVaccination}
            className="grid gap-3 rounded-xl border border-zinc-200 p-4 sm:grid-cols-3 dark:border-zinc-800"
          >
            <input type="hidden" name="medicalRecordId" value={record.id} />
            <div className="flex flex-col gap-1">
              <Label htmlFor="vaccineName">Vaccine</Label>
              <Input id="vaccineName" name="vaccineName" required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="vaccinationDate">Given on</Label>
              <Input
                id="vaccinationDate"
                name="vaccinationDate"
                type="date"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="nextDueDate">Next due</Label>
              <Input id="nextDueDate" name="nextDueDate" type="date" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="batchNumber">Batch no.</Label>
              <Input id="batchNumber" name="batchNumber" />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="vaccineNotes">Notes</Label>
              <Input id="vaccineNotes" name="notes" />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm">
                Add vaccination
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{children}</dd>
    </div>
  );
}
