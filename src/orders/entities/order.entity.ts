export interface OrderItemEntity {
  product_id: bigint;
  quantity: number;
  unit_price_cents?: number;
}

export interface OrderEntity {
  id?: bigint;
  user_id: bigint;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  total_cents: number;
  items: OrderItemEntity[];
}
