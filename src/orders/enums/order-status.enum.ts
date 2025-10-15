export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export type OrderStatusType = `${OrderStatusEnum}`;
