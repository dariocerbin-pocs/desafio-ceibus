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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create new product (ADMIN only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'is_active', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @Get()
  findAll(@Query('q') q?: string, @Query('is_active') isActive?: string) {
    return this.productsService.findAll({ q, isActive });
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(BigInt(id));
  }

  @ApiOperation({ summary: 'Update product (ADMIN only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(BigInt(id), dto);
  }

  @ApiOperation({ summary: 'Delete product (ADMIN only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(BigInt(id));
  }
}
