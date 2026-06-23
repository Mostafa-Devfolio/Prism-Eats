export interface OrderItemPayload {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  items: OrderItemPayload[];
}
