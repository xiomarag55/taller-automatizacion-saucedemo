import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  private carts = new Map<string, number[]>(); // username -> ids de producto

  constructor(private readonly products: ProductsService) {}

  get(user: string) {
    const items = (this.carts.get(user) ?? []).map((id) => this.products.findOne(id));
    return { count: items.length, items };
  }

  add(user: string, productId: number) {
    this.products.findOne(productId); // 404 si no existe
    const ids = this.carts.get(user) ?? [];
    if (ids.includes(productId)) throw new ConflictException('Product already in cart');
    this.carts.set(user, [...ids, productId]);
    return this.get(user);
  }

  remove(user: string, productId: number) {
    const ids = this.carts.get(user) ?? [];
    if (!ids.includes(productId)) throw new NotFoundException('Product not in cart');
    this.carts.set(user, ids.filter((i) => i !== productId));
    return this.get(user);
  }

  clear(user: string) {
    this.carts.delete(user);
  }

  reset() {
    this.carts.clear();
  }
}
