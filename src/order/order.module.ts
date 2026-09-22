import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { Order } from './entities/order.entity.js';
import { PassportModule } from '@nestjs/passport';
import { ProductModule } from '../product/product.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
