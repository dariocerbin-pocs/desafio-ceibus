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

  findById(id: bigint) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: true } });
  }

  updateStatus(id: bigint, status: OrderStatusEnum) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  async createWithStockTransaction(
    userId: bigint,
    items: { product_id: bigint; quantity: number }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const productIds = items.map((i) => i.product_id);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, stock: true, price_cents: true, is_active: true },
      });

      const idToProduct = new Map(products.map((p) => [p.id, p] as const));

      for (const item of items) {
        const product = idToProduct.get(item.product_id);
        if (!product) {
          throw new Error(`Producto id ${item.product_id.toString()} no existe`);
        }
        if (!product.is_active) {
          throw new Error(`Producto id ${item.product_id.toString()} inactivo`);
        }
        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para producto ${item.product_id.toString()} (stock=${product.stock}, requerido=${item.quantity})`,
          );
        }
      }

      // Descontar stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.product_id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const itemsData = items.map((i) => {
        const p = idToProduct.get(i.product_id)!;
        return {
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price_cents: p.price_cents,
        };
      });

      const total_cents = itemsData.reduce(
        (acc, it) => acc + it.quantity * Number(it.unit_price_cents),
        0,
      );

      const order = await tx.order.create({
        data: {
          user_id: userId,
          status: 'PENDING',
          total_cents: total_cents,
          items: { create: itemsData },
        },
        include: { items: true },
      });

      return order;
    });
  }

  async updateStatusWithStockTransaction(id: bigint, newStatus: OrderStatusEnum) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) {
        throw new Error('NOT_FOUND: Order not found');
      }

      if (order.status === newStatus) {
        return order; // no-op
      }

      // Only allow transitions from PENDING
      if (order.status !== 'PENDING') {
        throw new Error('BAD_REQUEST: Only PENDING orders can change status');
      }

      if (newStatus === 'CANCELLED') {
        // restore stock once when cancelling from PENDING
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.product_id },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      // PAID: no stock changes
      const updated = await tx.order.update({ where: { id }, data: { status: newStatus } });
      return updated;
    });
  }
}
