import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CopeCares Admin",
};

const modules = [
  {
    title: "Appointments",
    description: "Schedule, confirm, and track clinic visits.",
  },
  {
    title: "Pets",
    description: "Manage pet profiles and category assignments.",
  },
  {
    title: "Medical records",
    description: "Record diagnoses, treatments, and vaccinations.",
  },
  {
    title: "Point of sale",
    description: "Process sales, print receipts, and track inventory.",
  },
  {
    title: "Products",
    description: "Maintain stock levels, pricing, and categories.",
  },
  {
    title: "Services",
    description: "Configure clinic services and durations.",
  },
  {
    title: "Users",
    description: "Manage staff, veterinarians, and pet owners.",
  },
  {
    title: "Settings",
    description: "Clinic details, schedule, and POS preferences.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Setup complete. Modules will be wired up next.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <div
            key={module.title}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
              {module.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
