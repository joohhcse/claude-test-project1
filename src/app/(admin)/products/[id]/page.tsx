"use client";

import { use } from "react";
import { getProduct } from "@/lib/api";
import { useApi } from "@/hooks/use-api";
import { ProductForm } from "../product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useApi(
    () => getProduct(id),
    [id],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  return <ProductForm product={product} />;
}
