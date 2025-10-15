import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create new order (USER only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - User role required' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.USER)
  @Post()
  create(@Req() req: { user: { userId: bigint } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @ApiOperation({ summary: 'Get orders (USER: own orders, ADMIN: all orders)' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(
    @Req() req: { user: { userId: bigint; role: AppRole } },
    @Query('status') status?: string,
  ) {
    const statusEnum = status as OrderStatusEnum | undefined;
    return this.ordersService.findAll(req.user.userId, req.user.role, { status: statusEnum });
  }

  @ApiOperation({ summary: 'Get order by ID (strict ownership check)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only access own orders' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: { user: { userId: bigint; role: AppRole } }, @Param('id') id: bigint) {
    return this.ordersService.findOne(req.user.userId, id, req.user.role);
  }

  @ApiOperation({ summary: 'Update order status (ADMIN only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Body() dto: UpdateOrderStatusDto, @Param('id') id: bigint) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
