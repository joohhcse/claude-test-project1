"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import type { Product } from "@/domain/types/product";
import { CATEGORIES } from "@/lib/mock/products";

const productSchema = z.object({
  name: z.string().min(1, "상품명을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  stock: z.number().int().min(0, "재고는 0 이상이어야 합니다"),
  status: z.enum(["active", "draft", "soldout"]),
  description: z.string(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof productSchema>, string>>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [description, setDescription] = useState(product?.description ?? "");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [images, setImages] = useState<string[]>(
    product?.image && product.image !== "/placeholder.png"
      ? [product.image]
      : [],
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [aiLoading, setAiLoading] = useState<"desc" | "seo" | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleSave() {
    const result = productSchema.safeParse({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      status,
      description,
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormErrors;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    // Mock save — just go back
    router.push("/products");
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function generateDescription() {
    setAiLoading("desc");
    setTimeout(() => {
      setDescription(
        `${name || "이 상품"}은(는) 높은 품질과 세련된 디자인을 자랑합니다. ` +
          "엄선된 소재를 사용하여 내구성이 뛰어나며, " +
          "다양한 상황에서 활용할 수 있는 실용적인 제품입니다.",
      );
      setAiLoading(null);
    }, 1200);
  }

  function generateSeo() {
    setAiLoading("seo");
    setTimeout(() => {
      setSeoTitle(`${name || "상품"} - 최저가 | Mall Admin Store`);
      setSeoDesc(
        `${name || "상품"}을(를) 특별 할인가에 만나보세요. 빠른 배송, 무료 반품.`,
      );
      setAiLoading(null);
    }, 1200);
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {product ? "상품 수정" : "상품 등록"}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Basic info (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic info */}
          <section className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="font-semibold">기본 정보</h2>

            <Field label="상품명" error={errors.name} required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="카테고리" error={errors.category} required>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">선택</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="상태">
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "active" | "draft" | "soldout")
                  }
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="draft">임시저장</option>
                  <option value="active">판매중</option>
                  <option value="soldout">품절</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="가격 (원)" error={errors.price} required>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
              <Field label="재고" error={errors.stock} required>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
            </div>

            <Field label="상품 설명" error={errors.description}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={generateDescription}
                disabled={aiLoading !== null}
                className="mt-2 rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                {aiLoading === "desc" ? "생성 중..." : "AI 설명 생성"}
              </button>
            </Field>
          </section>

          {/* SEO */}
          <section className="rounded-lg border border-border bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">SEO 정보</h2>
              <button
                type="button"
                onClick={generateSeo}
                disabled={aiLoading !== null}
                className="rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                {aiLoading === "seo" ? "생성 중..." : "AI SEO 추천"}
              </button>
            </div>
            <Field label="SEO 제목">
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Field>
            <Field label="SEO 설명">
              <textarea
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Field>
          </section>
        </div>

        {/* Right: Image upload (1 col) */}
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="font-semibold">이미지</h2>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragOver
                  ? "border-primary bg-blue-50"
                  : "border-border hover:border-primary"
              }`}
            >
              <p className="text-sm text-muted-foreground">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG (최대 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((src, i) => (
                  <div key={i} className="group relative">
                    <img
                      src={src}
                      alt={`미리보기 ${i + 1}`}
                      className="h-24 w-full rounded-md border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* --- Field helper --- */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
