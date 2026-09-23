import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewService } from './review.service.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewDto } from './dto/review.dto.js';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'List reviews for a store' })
  @ApiOkResponse({ description: 'List of reviews.', type: ReviewDto, isArray: true })
  @Get('store/:storeId')
  async findByStoreId(@Param('storeId') storeId: string): Promise<ReviewDto[]> {
    return this.reviewService.findByStoreId(storeId);
  }

  @ApiOperation({ summary: 'Get a review owned by the current user' })
  @ApiOkResponse({ description: 'Review found successfully.', type: ReviewDto })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiBearerAuth()
  @Auth()
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string): Promise<ReviewDto> {
    return this.reviewService.findOne(id, userId);
  }

  @ApiOperation({ summary: 'Create a review for a product in a store' })
  @ApiCreatedResponse({ description: 'Review created successfully.', type: ReviewDto })
  @ApiNotFoundResponse({ description: 'Product not found for this store.' })
  @ApiBearerAuth()
  @Auth()
  @Post('product/:productId/store/:storeId')
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ): Promise<ReviewDto> {
    return this.reviewService.create(dto, userId, productId, storeId);
  }

  @ApiOperation({ summary: 'Update a review owned by the current user' })
  @ApiOkResponse({ description: 'Review updated successfully.', type: ReviewDto })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiBearerAuth()
  @Auth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateReviewDto>,
    @CurrentUser('id') userId: string,
  ): Promise<ReviewDto> {
    return this.reviewService.update(id, dto, userId);
  }

  @ApiOperation({ summary: 'Delete a review owned by the current user' })
  @ApiOkResponse({ description: 'Review deleted successfully.', type: String })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiBearerAuth()
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string): Promise<string> {
    return this.reviewService.delete(id, userId);
  }
}
