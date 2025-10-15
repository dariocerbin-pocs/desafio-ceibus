import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderEntity } from './entities/order.entity';
import { OrderStatusEnum } from './enums/order-status.enum';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(order: OrderEntity) {
    // unit_price_cents to be filled by service using product price
    return this.prisma.order.create({
      data: {
        user_id: order.user_id,
        status: order.status,
        total_cents: 0,
        items: {
          create: order.items.map((i) => ({
            product_id: BigInt(i.product_id),
            quantity: i.quantity,
            unit_price_cents: i.unit_price_cents ?? 0,
          })),
        },
      },
      include: { items: true },
    });
  }

  findAllByUser(userId: bigint, status?: OrderStatusEnum) {
    return this.prisma.order.findMany({
      where: { user_id: userId, status },
      orderBy: { created_at: 'desc' },
      include: { items: true },
    });
  }

  findAll(status?: OrderStatusEnum) {
    return this.prisma.order.findMany({
      where: { status },
      orderBy: { created_at: 'desc' },
      include: { items: true },
    });
  }

  findById(id: string | bigint) {
    const bid = typeof id === 'bigint' ? id : BigInt(id);
    return this.prisma.order.findUnique({ where: { id: bid }, include: { items: true } });
  }

  updateStatus(id: string | bigint, status: OrderStatusEnum) {
    const bid = typeof id === 'bigint' ? id : BigInt(id);
    return this.prisma.order.update({ where: { id: bid }, data: { status } });
  }
}
