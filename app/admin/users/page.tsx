import Link from "next/link";
import { Plus } from "lucide-react";

import { activateUser, deactivateUser } from "@/lib/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const currentUser = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { role: { select: { name: true, slug: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Staff accounts and pet owners."
        actions={
          <Link href="/admin/users/new" className={buttonVariants()}>
            <Plus className="size-4" />
            New user
          </Link>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableEmpty colSpan={6}>No users yet.</TableEmpty>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {user.name}
                    {user.id === currentUser.id ? (
                      <span className="ml-2 text-xs text-zinc-500">(you)</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge tone="info">{user.role?.name ?? "No role"}</Badge>
                </TableCell>
                <TableCell>{user.phone ?? "—"}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>
                  <Badge tone={user.isActive ? "success" : "default"}>
                    {user.isActive ? "active" : "inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Edit
                    </Link>
                    {user.id === currentUser.id ? null : (
                      <form
                        action={user.isActive ? deactivateUser : activateUser}
                      >
                        <input type="hidden" name="id" value={user.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
