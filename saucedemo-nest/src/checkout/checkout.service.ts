import { BadRequestException, Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';

export const TAX_RATE = 0.08;
const round = (n: number) => Math.round(n * 100) / 100;

@Injectable()
export class CheckoutService {
  private info = new Map<string, { firstName: string; lastName: string; postalCode: string }>();
  private orderSeq = 1000;

  constructor(private readonly cart: CartService) {}

  saveInfo(user: string, dto: { firstName?: string; lastName?: string; postalCode?: string }) {
    if (!dto?.firstName) throw new BadRequestException('Error: First Name is required');
    if (!dto?.lastName) throw new BadRequestException('Error: Last Name is required');
    if (!dto?.postalCode) throw new BadRequestException('Error: Postal Code is required');
    this.info.set(user, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      postalCode: dto.postalCode,
    });
    return { ok: true };
  }

  overview(user: string) {
    const { items, count } = this.cart.get(user);
    const itemTotal = round(items.reduce((s, p) => s + p.price, 0));
    const tax = round(itemTotal * TAX_RATE);
    return { count, items, itemTotal, tax, total: round(itemTotal + tax) };
  }

  finish(user: string) {
    if (!this.info.has(user)) throw new BadRequestException('Checkout information is missing');
    if (this.cart.get(user).count === 0) throw new BadRequestException('Cart is empty');
    this.cart.clear(user);
    this.info.delete(user);
    return { orderId: ++this.orderSeq, message: 'Thank you for your order!' };
  }

  reset() {
    this.info.clear();
  }
}
