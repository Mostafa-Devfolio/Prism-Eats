export interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CheckoutBody {
  customerName: string;
  customerPhone: string;
  address: string;
  totalAmount: number;
  paymentMethod: string;
  items: CheckoutItem[];
}
