import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto.js';

export class ProductWithRatingDto extends ProductDto {
  @ApiProperty({ description: 'Average rating across all reviews', example: 4.5 })
  rating: number;

  @ApiProperty({ description: 'Total number of reviews', example: 12 })
  reviewsCount: number;
}
