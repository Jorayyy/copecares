"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveProduct } from "@/lib/actions/products";
import type { ActionState } from "@/lib/action-state";
import { buttonVariants } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";

type Product = {
  id: number;
  name: string;
  sku: string | null;
  description: string | null;
  costPrice: string;
  sellingPrice: string;
  stockQuantity: number;
  reorderLevel: number;
  unit: string;
  isActive: boolean;
  productCategoryId: number | null;
};

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: { id: number; name: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveProduct,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="productCategoryId">Category</Label>
        <Select
          id="productCategoryId"
          name="productCategoryId"
          defaultValue={product?.productCategoryId ?? ""}
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="costPrice">Cost price (PHP)</Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.costPrice ?? "0"}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sellingPrice">Selling price (PHP)</Label>
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.sellingPrice ?? "0"}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            defaultValue={product?.stockQuantity ?? 0}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="reorderLevel">Reorder level</Label>
          <Input
            id="reorderLevel"
            name="reorderLevel"
            type="number"
            min="0"
            defaultValue={product?.reorderLevel ?? 10}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            name="unit"
            defaultValue={product?.unit ?? "piece"}
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={product?.isActive ?? true}
          className="size-4 rounded border-zinc-300 text-dusk-600"
        />
        Active
      </label>

      <FormError message={state?.error} />

      <div className="flex items-center gap-2">
        <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
        <Link
          href="/admin/products"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
