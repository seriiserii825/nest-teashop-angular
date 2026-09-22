import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
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

  async findAll(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: { order_items: { product: true, store: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
      relations: { order_items: { product: true, store: true } },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async update(id: string, userId: string, dto: UpdateOrderDto) {
    const order = await this.findOne(id, userId);
    if (dto.status) {
      order.status = dto.status;
    }
    return this.orderRepository.save(order);
  }

  async remove(id: string, userId: string) {
    const order = await this.findOne(id, userId);
    return this.orderRepository.remove(order);
  }
}
