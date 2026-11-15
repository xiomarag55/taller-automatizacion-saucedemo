import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';
import { CheckoutService } from './checkout/checkout.service';

/** Aísla escenarios: deja el SUT en estado inicial (sin sesiones, carritos ni checkouts). */
@Controller('api/test')
export class TestSupportController {
  constructor(
    private readonly auth: AuthService,
    private readonly cart: CartService,
    private readonly checkout: CheckoutService,
  ) {}

  @Post('reset')
  @HttpCode(204)
  reset() {
    this.auth.reset();
    this.cart.reset();
    this.checkout.reset();
  }
}
