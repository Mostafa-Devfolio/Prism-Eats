export interface CartItem {
  id: string;
  nameEn: string;
  nameAr: string;
  price: number;
  quantity: number;
  imageUrl: string|null;
}

export interface CartState {
  items: CartItem[];
}
