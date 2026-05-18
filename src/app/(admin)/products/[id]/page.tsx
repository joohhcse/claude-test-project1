"use client";

import { use } from "react";
import { mockProducts } from "@/lib/mock/products";
import { ProductForm } from "../product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  return <ProductForm product={product} />;
}
