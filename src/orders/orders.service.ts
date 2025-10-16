import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { OrdersRepository } from './orders.repository';
import { AppRole } from '../common/roles.enum';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(userId: bigint, dto: CreateOrderDto) {
    try {
      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException('Order must contain at least one item');
      }

      const items = dto.items.map((i) => ({
        product_id: BigInt(i.product_id),
        quantity: i.quantity,
      }));

      return await this.ordersRepository.createWithStockTransaction(userId, items);
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
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
      return this.ordersRepository.updateStatusWithStockTransaction(id, status);
    } catch (error: any) {
      if (typeof error?.message === 'string') {
        if (error.message.startsWith('NOT_FOUND:')) {
          throw new NotFoundException(error.message.replace('NOT_FOUND: ', ''));
        }
        if (error.message.startsWith('BAD_REQUEST:')) {
          throw new BadRequestException(error.message.replace('BAD_REQUEST: ', ''));
        }
      }
      throw new InternalServerErrorException({
        message: `error al actualizar Order status: ${id}`,
        error: error?.message ?? String(error),
      });
    }
  }
}
