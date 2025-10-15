import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll(@Query('q') q?: string, @Query('is_active') isActive?: string) {
    return this.productsService.findAll({ q, isActive });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(BigInt(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(BigInt(id));
  }
}
