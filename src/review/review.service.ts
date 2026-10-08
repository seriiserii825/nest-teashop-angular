import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MessageResponseDto } from '../common/dto/message-response.dto.js';
import { ProductService } from '../product/product.service.js';
import { StoreService } from '../store/store.service.js';
import { Review } from './entities/review.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {}

  async findByStoreId(storeId: string): Promise<Review[]> {
    const products = await this.productService.findByStoreId(storeId);
    const productIds = products.map((product) => product.id);

    return this.reviewRepository.find({
      where: { productId: In(productIds) },
      relations: {
        user: true,
      },
      // Без явного order Postgres не гарантирует порядок строк — после UPDATE
      // строка физически переносится и "уезжает" в другое место скана
      order: { createdAt: 'DESC', id: 'ASC' },
    });
  }

  // Отзывы модерирует владелец магазина, а не их автор — поэтому доступ
  // проверяем через владение storeId, а не через review.userId
  async findOne(id: string, storeId: string, userId: string): Promise<Review> {
    await this.storeService.findOne(storeId, userId);

    const review = await this.reviewRepository.findOne({
      where: { id, storeId },
      relations: {
        user: true,
        product: true,
        store: true,
      },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async create(
    dto: CreateReviewDto,
    userId: string,
    productId: string,
  ): Promise<Review> {
    const product = await this.productService.findOne(productId);

    const review = this.reviewRepository.create({
      ...dto,
      userId,
      productId,
      storeId: product.storeId,
    });
    return this.reviewRepository.save(review);
  }

  async update(
    id: string,
    storeId: string,
    dto: UpdateReviewDto,
    userId: string,
  ): Promise<Review> {
    const review = await this.findOne(id, storeId, userId);
    Object.assign(review, dto);
    return this.reviewRepository.save(review);
  }

  async delete(id: string, storeId: string, userId: string): Promise<MessageResponseDto> {
    const review = await this.findOne(id, storeId, userId);
    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }

  async calculateAverageRating(storeId: string): Promise<number> {
    const reviews = await this.findByStoreId(storeId);
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}
