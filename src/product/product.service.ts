import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Not, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service.js';
import { ColorService } from '../color/color.service.js';
import { OrderItem } from '../order-item/entities/order-item.entity.js';
import { StoreService } from '../store/store.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly storeService: StoreService,
    private readonly categoryService: CategoryService,
    private readonly colorService: ColorService,
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
    return this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
    });
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

  async findByRelatedCategory(productId: string): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return this.productRepository.find({
      where: {
        category: { id: product.category.id },
        id: Not(productId),
      },
      relations: { store: true, category: true, color: true, reviews: true },
    });
  }

  async create(
    userId: string,
    storeId: string,
    dto: CreateProductDto,
  ): Promise<Product> {
    await this.storeService.findOne(storeId, userId);
    await this.categoryService.getByStoreId(userId, storeId, dto.categoryId);
    await this.colorService.getByStoreId(userId, storeId, dto.colorId);

    const existingProduct = await this.productRepository.findOne({
      where: { description: dto.description },
    });
    if (existingProduct) {
      throw new BadRequestException(
        `Product with description "${dto.description}" already exists`,
      );
    }

    const product = this.productRepository.create({ ...dto, storeId });
    return this.productRepository.save(product);
  }

  async update(
    userId: string,
    storeId: string,
    productId: string,
    dto: UpdateProductDto,
  ): Promise<Product> {
    await this.storeService.findOne(storeId, userId);

    const product = await this.productRepository.findOne({
      where: { id: productId, storeId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${productId} not found for store ${storeId}`,
      );
    }

    if (dto.categoryId) {
      await this.categoryService.getByStoreId(userId, storeId, dto.categoryId);
    }
    if (dto.colorId) {
      await this.colorService.getByStoreId(userId, storeId, dto.colorId);
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async delete(
    userId: string,
    storeId: string,
    productId: string,
  ): Promise<void> {
    await this.storeService.findOne(storeId, userId);

    const product = await this.productRepository.findOne({
      where: { id: productId, storeId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${productId} not found for store ${storeId}`,
      );
    }

    await this.productRepository.remove(product);
  }
}
