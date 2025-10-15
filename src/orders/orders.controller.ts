import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AppRole } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.USER)
  @Post()
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(BigInt(req.user.userId), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Req() req: any, @Query('status') status?: string) {
    const statusEnum = status as OrderStatusEnum | undefined;
    return this.ordersService.findAll(BigInt(req.user.userId), { status: statusEnum });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.findOne(BigInt(req.user.userId), id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
