import { deleteMessage, markMessageRead } from "@/lib/actions/messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { EmptyState } from "@/components/ui/empty-state";
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
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  await requireAdmin();

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        description="Inquiries sent from the clinic website."
      />

      {messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Messages from the public contact form will appear here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableEmpty colSpan={6}>No messages found.</TableEmpty>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <span className="block font-medium">{message.name}</span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                      {message.email}
                      {message.phone ? ` · ${message.phone}` : ""}
                    </span>
                  </TableCell>
                  <TableCell>{message.subject ?? "—"}</TableCell>
                  <TableCell className="max-w-72 whitespace-pre-wrap">
                    {message.message}
                  </TableCell>
                  <TableCell>{formatDateTime(message.createdAt)}</TableCell>
                  <TableCell>
                    <Badge tone={message.isRead ? "default" : "warning"}>
                      {message.isRead ? "read" : "new"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {message.isRead ? null : (
                        <form action={markMessageRead}>
                          <input type="hidden" name="id" value={message.id} />
                          <Button type="submit" variant="ghost" size="sm">
                            Mark read
                          </Button>
                        </form>
                      )}
                      <form action={deleteMessage}>
                        <input type="hidden" name="id" value={message.id} />
                        <DeleteButton message="Delete this message?" />
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
