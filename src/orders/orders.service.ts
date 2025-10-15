import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { OrderEntity } from './entities/order.entity';
import { OrderStatusEnum } from './enums/order-status.enum';
import { OrdersRepository } from './orders.repository';
import { AppRole } from '../common/roles.enum';

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
          (i: { product_id: string | number | bigint | boolean; quantity: number }) => ({
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

  findAll(userId: bigint, role: AppRole, filter: { status?: OrderStatusEnum }) {
    try {
      if (role === AppRole.ADMIN) {
        return this.ordersRepository.findAll(filter.status);
      }
      return this.ordersRepository.findAllByUser(userId, filter.status);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al buscar Orders`,
        error: error?.message ?? String(error),
      });
    }
  }

  async findOne(userId: bigint, id: bigint, role?: AppRole) {
    try {
      const order = await this.ordersRepository.findById(id);
      if (!order) throw new NotFoundException('Order not found');
      if (role !== AppRole.ADMIN && order.user_id !== userId) {
        throw new ForbiddenException('Forbidden');
      }
      return order;
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al buscar Order id: ${id}`,
        error: error?.message ?? String(error),
      });
    }
  }

  updateStatus(id: bigint, status: OrderStatusEnum) {
    try {
      return this.ordersRepository.updateStatus(id, status);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al actualizar Order status: ${id}`,
        error: error?.message ?? String(error),
      });
    }
  }
}
