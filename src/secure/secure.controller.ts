import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('secure')
export class SecureController {
  @UseGuards(JwtAuthGuard)
  @Get()
  whoAmI(@Req() req: any) {
    return { userId: req.user.userId };
  }
}
