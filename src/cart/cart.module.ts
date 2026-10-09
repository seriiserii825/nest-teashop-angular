import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module.js';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { Cart } from './entities/cart.entity.js';
import { CartItem } from './entities/cart-item.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
