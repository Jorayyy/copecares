import Link from "next/link";
import { Plus } from "lucide-react";

import { deleteProduct } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { PageHeader } from "@/components/ui/page-header";
import { Thumbnail } from "@/components/ui/thumbnail";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPeso } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { productCategory: { select: { name: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Inventory, pricing, and stock levels."
        actions={
          <Link href="/admin/products/new" className={buttonVariants()}>
            <Plus className="size-4" />
            New product
          </Link>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableEmpty colSpan={7}>No products yet.</TableEmpty>
          ) : (
            products.map((product) => {
              const lowStock = product.stockQuantity <= product.reorderLevel;

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Thumbnail src={product.image} alt={product.name} />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {product.sku ?? "No SKU"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.productCategory?.name ?? "—"}</TableCell>
                  <TableCell>{formatPeso(product.costPrice)}</TableCell>
                  <TableCell>{formatPeso(product.sellingPrice)}</TableCell>
                  <TableCell>
                    <Badge tone={lowStock ? "danger" : "success"}>
                      {product.stockQuantity} {product.unit}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge tone={product.isActive ? "success" : "default"}>
                      {product.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        Edit
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <DeleteButton />
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
