import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service.js';
import { ReviewController } from './review.controller.js';
import { Review } from './entities/review.entity.js';
import { ProductModule } from '../product/product.module.js';
import { StoreModule } from '../store/store.module.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ProductModule,
    StoreModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
