import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity.js';

export class ProductDto extends OmitType(Product, [
  'order_items',
  'users',
] as const) {
  @ApiProperty({ description: 'Average rating across all reviews', example: 4.5 })
  rating: number;

  @ApiProperty({ description: 'Total number of reviews', example: 12 })
  reviewsCount: number;
}
