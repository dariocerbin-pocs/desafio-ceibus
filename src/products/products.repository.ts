import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(entity: ProductEntity) {
    return this.prisma.product.create({ data: entity });
  }

  findAll(filter: { q?: string; isActive?: boolean }) {
    const where: any = {};
    if (typeof filter.isActive === 'boolean') where.is_active = filter.isActive;
    if (filter.q && filter.q.trim()) {
      where.name = { contains: filter.q.trim(), mode: 'insensitive' as const };
    }
    return this.prisma.product.findMany({ where, orderBy: { created_at: 'desc' } });
  }

  findById(id: bigint) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  update(id: bigint, entity: Partial<ProductEntity>) {
    return this.prisma.product.update({ where: { id }, data: entity });
  }

  remove(id: bigint) {
    return this.prisma.product.delete({ where: { id } });
  }
}
