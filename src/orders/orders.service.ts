import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { OrderEntity } from './entities/order.entity';
import { OrderStatusEnum } from './enums/order-status.enum';
import { OrdersRepository } from './orders.repository.js';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  create(userId: bigint, dto: CreateOrderDto) {
    try {
      // NOTE: business logic to compute totals from product prices comes later
      const order: OrderEntity = {
        user_id: userId,
        status: 'PENDING',
        total_cents: 0,
        items: dto.items.map(
          (i: { product_id: string | number | bigint | boolean; quantity: any }) => ({
            product_id: BigInt(i.product_id),
            quantity: i.quantity,
          }),
        ),
      };
      return this.ordersRepository.create(order);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al crear Order`,
        error: error?.message ?? String(error),
      });
    }
  }

  findAll(userId: bigint, filter: { status?: OrderStatusEnum }) {
    try {
      if (filter.status) {
        return this.ordersRepository.findAllByUser(userId, filter.status as any);
      }
      return this.ordersRepository.findAllByUser(userId, undefined);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al buscar Orders`,
        error: error?.message ?? String(error),
      });
    }
  }

  findOne(userId: bigint, id: string) {
    try {
      void userId; // reserved for access control checks
      return this.ordersRepository.findById(id);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al buscar Order id: ${id}`,
        error: error?.message ?? String(error),
      });
    }
  }

  updateStatus(id: string, status: OrderStatusEnum) {
    try {
      return this.ordersRepository.updateStatus(id, status as any);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al actualizar Order status: ${id}`,
        error: error?.message ?? String(error),
      });
    }
  }
}
