export interface IProduct {
  products: Product[];
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  description?: string | null;
  price: number;
  imageUrl: string | null;
}
