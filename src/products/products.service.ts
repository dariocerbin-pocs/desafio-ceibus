import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  create(dto: CreateProductDto) {
    return { message: 'create product - not implemented', dto };
  }

  findAll(filter: { q?: string; isActive?: string }) {
    return { message: 'list products - not implemented', filter };
  }

  findOne(id: bigint) {
    return { message: 'get product - not implemented', id };
  }

  update(id: bigint, dto: UpdateProductDto) {
    return { message: 'update product - not implemented', id, dto };
  }

  remove(id: bigint) {
    return { message: 'delete product - not implemented', id };
  }
}
