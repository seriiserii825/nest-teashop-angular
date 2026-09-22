import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductService } from '../product/product.service.js';
import { Review } from './entities/review.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productService: ProductService,
  ) {}

  async findByStoreId(storeId: string): Promise<Review[]> {
    const products = await this.productService.findByStoreId(storeId);
    const productIds = products.map((product) => product.id);

    return this.reviewRepository.find({
      where: { productId: In(productIds) },
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id, userId },
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
    storeId: string,
  ): Promise<Review> {
    const review = this.reviewRepository.create({
      ...dto,
      userId,
      productId,
      storeId,
    });
    return this.reviewRepository.save(review);
  }

  async update(
    id: string,
    dto: Partial<CreateReviewDto>,
    userId: string,
  ): Promise<Review> {
    const review = await this.findOne(id, userId);
    Object.assign(review, dto);
    return this.reviewRepository.save(review);
  }

  async delete(id: string, userId: string): Promise<string> {
    const review = await this.findOne(id, userId);
    await this.reviewRepository.remove(review);
    return 'Review deleted successfully';
  }
}
