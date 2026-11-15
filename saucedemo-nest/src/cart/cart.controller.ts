import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  get(@Req() req: any) {
    return this.cart.get(req.user.username);
  }

  @Post(':productId')
  add(@Req() req: any, @Param('productId', ParseIntPipe) id: number) {
    return this.cart.add(req.user.username, id);
  }

  @Delete(':productId')
  remove(@Req() req: any, @Param('productId', ParseIntPipe) id: number) {
    return this.cart.remove(req.user.username, id);
  }
}
