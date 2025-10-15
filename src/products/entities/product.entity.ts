export interface ProductEntity {
  id?: bigint;
  name: string;
  price_cents: number;
  stock: number;
  is_active?: boolean;
}
