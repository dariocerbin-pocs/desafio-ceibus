import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.USER)
  @Post()
  create(@Req() req: { user: { userId: bigint } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(
    @Req() req: { user: { userId: bigint; role: AppRole } },
    @Query('status') status?: string,
  ) {
    const statusEnum = status as OrderStatusEnum | undefined;
    return this.ordersService.findAll(req.user.userId, req.user.role, { status: statusEnum });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: { user: { userId: bigint; role: AppRole } }, @Param('id') id: bigint) {
    return this.ordersService.findOne(req.user.userId, id, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Body() dto: UpdateOrderStatusDto, @Param('id') id: bigint) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
