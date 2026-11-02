"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveUser } from "@/lib/actions/users";
import type { ActionState } from "@/lib/action-state";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  roleId: number | null;
  isActive: boolean;
};

export function UserForm({
  user,
  roles,
  isSelf,
}: {
  user?: User;
  roles: { id: number; name: string }[];
  isSelf?: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveUser,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {user ? <input type="hidden" name="id" value={user.id} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" defaultValue={user?.name} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={user?.phone ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="roleId">Role</Label>
          <Select
            id="roleId"
            name="roleId"
            defaultValue={user?.roleId ?? ""}
            required
          >
            <option value="" disabled>
              Select role
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" defaultValue={user?.address ?? ""} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">
          {user ? "New password" : "Password"}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required={!user}
          placeholder={user ? "Leave blank to keep current password" : undefined}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={user?.isActive ?? true}
          disabled={isSelf}
          className="size-4 rounded border-zinc-300 text-emerald-600 disabled:opacity-50"
        />
        Active account
        {isSelf ? (
          <span className="text-xs text-zinc-500">(you cannot deactivate yourself)</span>
        ) : null}
      </label>
      {isSelf ? <input type="hidden" name="isActive" value="on" /> : null}

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{user ? "Save changes" : "Create user"}</SubmitButton>
        <Link href="/admin/users" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
