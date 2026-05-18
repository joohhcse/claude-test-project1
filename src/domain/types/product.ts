export type ProductStatus = "active" | "draft" | "soldout";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string;
  description: string;
  createdAt: string;
}
