import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { OrderItem } from '../order-item/entities/order-item.entity.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(searchTerm?: string): Promise<Product[]> {
    if (searchTerm) {
      const filter = this.getBySearchTerm(searchTerm);
      return this.productRepository.find({
        where: filter,
        order: { createdAt: 'DESC' },
        relations: {
          store: true,
          category: true,
          color: true,
          reviews: true,
        },
      });
    }
    return this.productRepository.find();
  }

  private getBySearchTerm(searchTerm: string) {
    return [
      { title: ILike(`%${searchTerm}%`) },
      { description: ILike(`%${searchTerm}%`) },
    ];
  }

  findByStoreId(storeId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { store: { id: storeId } },
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
    });
    if (products.length === 0) {
      throw new NotFoundException(
        `Product with category ID ${categoryId} not found`,
      );
    }
    return products;
  }

  async findByMostPopular(limit = 10): Promise<Product[]> {
    const popular = await this.productRepository.manager
      .createQueryBuilder(OrderItem, 'orderItem')
      .select('orderItem.productId', 'productId')
      .addSelect('COUNT(orderItem.id)', 'count')
      .groupBy('orderItem.productId')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany<{ productId: string; count: string }>();

    const productIds = popular.map((p) => p.productId);
    if (productIds.length === 0) return [];

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: { store: true, category: true, color: true, reviews: true },
    });

    // find() по In() не гарантирует порядок — восстанавливаем по popular
    const order = new Map(productIds.map((id, i) => [id, i]));
    return products.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  }
}
