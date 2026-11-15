import { Injectable, NotFoundException } from '@nestjs/common';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const PRODUCTS: Product[] = [
  { id: 4, name: 'Sauce Labs Backpack', description: 'carry.allTheThings() with the sleek, streamlined Sly Pack.', price: 29.99 },
  { id: 0, name: 'Sauce Labs Bike Light', description: 'A red light is not the desired state in testing but it sure helps when riding your bike at night.', price: 9.99 },
  { id: 1, name: 'Sauce Labs Bolt T-Shirt', description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt.', price: 15.99 },
  { id: 5, name: 'Sauce Labs Fleece Jacket', description: 'A midweight quarter-zip fleece jacket capable of handling every day throughout the year.', price: 49.99 },
  { id: 2, name: 'Sauce Labs Onesie', description: 'Rib snap infant onesie for the junior automation engineer in development.', price: 7.99 },
  { id: 3, name: 'Test.allTheThings() T-Shirt (Red)', description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard.', price: 15.99 },
];

@Injectable()
export class ProductsService {
  findAll(): Product[] {
    return PRODUCTS;
  }

  findOne(id: number): Product {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) throw new NotFoundException(`Product ${id} not found`);
    return p;
  }
}
