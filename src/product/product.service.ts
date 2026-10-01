import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Not, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service.js';
import { ColorService } from '../color/color.service.js';
import { MessageResponseDto } from '../common/dto/message-response.dto.js';
import { FileService } from '../file/file.service.js';
import { OrderItem } from '../order-item/entities/order-item.entity.js';
import { StoreService } from '../store/store.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductDto } from './dto/product.dto.js';
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
    private readonly fileService: FileService,
  ) {}

  async findAll(searchTerm?: string): Promise<ProductDto[]> {
    if (searchTerm) {
      const filter = this.getBySearchTerm(searchTerm);
      const products = await this.productRepository.find({
        where: filter,
        order: { createdAt: 'DESC' },
        relations: {
          store: true,
          category: true,
          color: true,
          reviews: true,
        },
      });
      return products.map((product) => this.withRating(product));
    }
    const products = await this.productRepository.find({
      relations: { reviews: true },
    });
    return products.map((product) => this.withRating(product));
  }

  async findLatest(limit = 10): Promise<ProductDto[]> {
    const products = await this.productRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
    });
    return products.map((product) => this.withRating(product));
  }

  private getBySearchTerm(searchTerm: string) {
    return [
      { title: ILike(`%${searchTerm}%`) },
      { description: ILike(`%${searchTerm}%`) },
    ];
  }

  async findByStoreId(storeId: string): Promise<ProductDto[]> {
    const products = await this.productRepository.find({
      where: { store: { id: storeId } },
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
      // Без явного order Postgres не гарантирует порядок строк — после UPDATE
      // строка физически переносится и "уезжает" в другое место скана
      order: { createdAt: 'DESC', id: 'ASC' },
    });
    return products.map((product) => this.withRating(product));
  }

  async findOne(id: string): Promise<ProductDto> {
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
    return this.withRating(product);
  }

  async findByCategoryId(categoryId: string): Promise<ProductDto[]> {
    const products = await this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: {
        store: true,
        category: true,
        color: true,
        reviews: true,
      },
    });
    return products.map((product) => this.withRating(product));
  }

  async findByMostPopular(limit = 10): Promise<ProductDto[]> {
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
    return products
      .sort((a, b) => order.get(a.id)! - order.get(b.id)!)
      .map((product) => this.withRating(product));
  }

  async findByRelatedCategory(
    productId: string,
  ): Promise<ProductDto[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const products = await this.productRepository.find({
      where: {
        category: { id: product.category.id },
        id: Not(productId),
      },
      relations: { store: true, category: true, color: true, reviews: true },
    });
    return products.map((product) => this.withRating(product));
  }

  async create(
    userId: string,
    storeId: string,
    dto: CreateProductDto,
  ): Promise<ProductDto> {
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
    const saved = await this.productRepository.save(product);
    // У нового продукта отзывов ещё нет
    return this.withRating({ ...saved, reviews: [] });
  }

  async update(
    userId: string,
    storeId: string,
    productId: string,
    dto: UpdateProductDto,
  ): Promise<ProductDto> {
    await this.storeService.findOne(storeId, userId);

    const product = await this.productRepository.findOne({
      where: { id: productId, storeId },
      relations: { reviews: true },
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
    return this.withRating(await this.productRepository.save(product));
  }

  async delete(
    userId: string,
    storeId: string,
    productId: string,
  ): Promise<MessageResponseDto> {
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
    await Promise.all(
      product.images.map((url) => this.fileService.deleteFileByUrl(url)),
    );
    return { message: 'Product deleted successfully' };
  }

  // Требует загруженной relation `reviews`
  private withRating(product: Product): ProductDto {
    const reviewsCount = product.reviews.length;
    const rating =
      reviewsCount === 0
        ? 0
        : product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewsCount;
    return { ...product, rating, reviewsCount };
  }

  async countByStoreId(storeId: string): Promise<number> {
    return this.productRepository.count({ where: { storeId } });
  }
}
