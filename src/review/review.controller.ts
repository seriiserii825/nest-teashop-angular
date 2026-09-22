import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('store/:storeId')
  async findByStoreId(@Param('storeId') storeId: string) {
    return this.reviewService.findByStoreId(storeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reviewService.findOne(id, userId);
  }

  @Auth()
  @Post('product/:productId/store/:storeId')
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.reviewService.create(dto, userId, productId, storeId);
  }

  @Auth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateReviewDto>,
    @CurrentUser('id') userId: string,
  ) {
    return this.reviewService.update(id, dto, userId);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.reviewService.delete(id, userId);
  }
}
