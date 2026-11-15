import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { TestSupportController } from './test-support.controller';

@Module({
  imports: [AuthModule, ProductsModule, CartModule, CheckoutModule],
  controllers: [TestSupportController],
})
export class AppModule {}
