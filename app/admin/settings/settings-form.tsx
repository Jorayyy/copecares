"use client";

import { useActionState } from "react";

import { createSetting, saveSettings } from "@/lib/actions/settings";
import type { ActionState } from "@/lib/action-state";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";

type Setting = { id: number; key: string; value: string | null; group: string };

const labels: Record<string, string> = {
  clinic_name: "Clinic name",
  clinic_short_name: "Clinic short name",
  clinic_email: "Clinic email",
  clinic_phone: "Clinic phone",
  clinic_address: "Clinic address",
  opening_time: "Opening time",
  closing_time: "Closing time",
  appointment_duration: "Appointment duration (minutes)",
  max_appointments_per_day: "Max appointments per day",
  tax_rate: "Tax rate (%)",
  currency_symbol: "Currency symbol",
  receipt_footer: "Receipt footer",
};

export function SettingsForm({ settings }: { settings: Setting[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveSettings,
    undefined,
  );
  const [createState, createAction] = useActionState<ActionState, FormData>(
    createSetting,
    undefined,
  );

  const groups = Array.from(new Set(settings.map((setting) => setting.group)));

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex flex-col gap-6">
        {groups.map((group) => (
          <section
            key={group}
            className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-sm font-semibold text-zinc-900 capitalize dark:text-zinc-50">
              {group}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {settings
                .filter((setting) => setting.group === group)
                .map((setting) => (
                  <div key={setting.id} className="flex flex-col gap-2">
                    <Label htmlFor={`setting-${setting.key}`}>
                      {labels[setting.key] ?? setting.key}
                    </Label>
                    <Input
                      id={`setting-${setting.key}`}
                      name={`setting:${setting.key}`}
                      defaultValue={setting.value ?? ""}
                    />
                  </div>
                ))}
            </div>
          </section>
        ))}

        <FormError message={state?.error} />
        {state?.success ? (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {state.success}
          </p>
        ) : null}

        <div>
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </form>

      <form
        action={createAction}
        className="flex max-w-3xl flex-col gap-4 rounded-lg border border-dashed border-zinc-300 p-5 dark:border-zinc-700"
      >
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Add setting
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="newKey">Key</Label>
            <Input id="newKey" name="newKey" placeholder="e.g. facebook_url" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="newValue">Value</Label>
            <Input id="newValue" name="newValue" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="newGroup">Group</Label>
            <Select id="newGroup" name="newGroup" defaultValue="general">
              <option value="general">general</option>
              <option value="schedule">schedule</option>
              <option value="pos">pos</option>
            </Select>
          </div>
        </div>
        <FormError message={createState?.error} />
        <div>
          <SubmitButton variant="outline">Add setting</SubmitButton>
        </div>
      </form>
    </div>
  );
}
