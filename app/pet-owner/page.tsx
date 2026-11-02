import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My pets | CopeCares",
};

export default function PetOwnerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          My dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Your pet profiles and appointments will appear here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
            My pets
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your pets and keep their details up to date.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
            Appointments
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Book a visit and review your upcoming schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
