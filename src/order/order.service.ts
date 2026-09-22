import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
  ) {}

  async create(dto: CreateOrderDto, userId: string) {
    const orderItems = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.productService.findOne(item.productId);
        return {
          productId: product.id,
          storeId: product.storeId,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.orderRepository.create({
      userId,
      total,
      order_items: orderItems,
    });

    return this.orderRepository.save(order);
  }
}
