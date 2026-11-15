import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/checkout')
@UseGuards(AuthGuard)
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post('info')
  @HttpCode(200)
  info(@Req() req: any, @Body() body: any) {
    return this.checkout.saveInfo(req.user.username, body);
  }

  @Get('overview')
  overview(@Req() req: any) {
    return this.checkout.overview(req.user.username);
  }

  @Post('finish')
  @HttpCode(200)
  finish(@Req() req: any) {
    return this.checkout.finish(req.user.username);
  }
}
