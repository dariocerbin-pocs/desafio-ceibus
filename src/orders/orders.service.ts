import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  create(userId: bigint, dto: CreateOrderDto) {
    return { message: 'create order - not implemented', userId, dto };
  }

  findAll(userId: bigint, filter: { status?: string }) {
    return { message: 'list orders - not implemented', userId, filter };
  }

  findOne(userId: bigint, id: string) {
    return { message: 'get order - not implemented', userId, id };
  }

  updateStatus(id: string, status: 'PAID' | 'CANCELLED') {
    return { message: 'update order status - not implemented', id, status };
  }
}
