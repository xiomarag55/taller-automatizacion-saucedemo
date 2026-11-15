import { ConflictException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';

describe('CartService', () => {
  let cart: CartService;
  beforeEach(() => (cart = new CartService(new ProductsService())));

  it('inicia con carrito vacio', () => {
    expect(cart.get('u')).toEqual({ count: 0, items: [] });
  });

  it('agrega productos y actualiza el contador', () => {
    cart.add('u', 4);
    expect(cart.add('u', 0).count).toBe(2);
  });

  it('no permite agregar dos veces el mismo producto', () => {
    cart.add('u', 4);
    expect(() => cart.add('u', 4)).toThrow(ConflictException);
  });

  it('rechaza productos inexistentes', () => {
    expect(() => cart.add('u', 999)).toThrow(NotFoundException);
  });

  it('elimina un producto del carrito', () => {
    cart.add('u', 4);
    cart.add('u', 0);
    const r = cart.remove('u', 4);
    expect(r.count).toBe(1);
    expect(r.items[0].id).toBe(0);
  });

  it('no permite eliminar un producto que no esta en el carrito', () => {
    expect(() => cart.remove('u', 4)).toThrow(NotFoundException);
  });

  it('los carritos de usuarios distintos son independientes', () => {
    cart.add('a', 4);
    expect(cart.get('b').count).toBe(0);
  });
});
