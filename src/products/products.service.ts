import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  create(dto: CreateProductDto) {
    try {
      return this.productsRepository.create(dto);
    } catch (error: any) {
      // Re-throw; filters/interceptors handle logging/formatting
      throw new InternalServerErrorException({
        message: `error al crear Product`,
        error: error?.message ?? String(error),
      });
    }
  }

  findAll(filter: { q?: string; isActive?: string }) {
    try {
      return this.productsRepository.findAll({
        q: filter.q,
        isActive: typeof filter.isActive === 'string' ? filter.isActive === 'true' : undefined,
      });
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al buscar Product`,
        error: error?.message ?? String(error),
      });
    }
  }

  async findOne(id: bigint) {
    try {
      const product = await this.productsRepository.findById(id);
      if (!product) {
        throw new NotFoundException(`Product id ${id.toString()} not found`);
      }
      return product;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: `error al buscar Product`,
        error: error?.message ?? String(error),
      });
    }
  }

  update(id: bigint, dto: UpdateProductDto) {
    try {
      return this.productsRepository.update(id, dto);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al actualizar Product`,
        error: error?.message ?? String(error),
      });
    }
  }

  remove(id: bigint) {
    try {
      return this.productsRepository.remove(id);
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: `error al eliminar Product`,
        error: error?.message ?? String(error),
      });
    }
  }
}
