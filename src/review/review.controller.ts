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
import { MessageResponseDto } from '../common/dto/message-response.dto.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
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

  @ApiOperation({ summary: 'Get a review within a store' })
  @ApiOkResponse({ description: 'Review found successfully.', type: ReviewDto })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiBearerAuth()
  @Auth()
  @Get('store/:storeId/review/:id')
  async findOne(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
    @CurrentUser('id') userId: string,
  ): Promise<ReviewDto> {
    return this.reviewService.findOne(id, storeId, userId);
  }

  @ApiOperation({ summary: 'Create a review for a product' })
  @ApiCreatedResponse({ description: 'Review created successfully.', type: ReviewDto })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiBearerAuth()
  @Auth()
  @Post('product/:productId')
  async create(
    @Body() dto: CreateReviewDto,
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<ReviewDto> {
    return this.reviewService.create(dto, userId, productId);
  }

  @ApiOperation({ summary: 'Update a review within a store' })
  @ApiOkResponse({ description: 'Review updated successfully.', type: ReviewDto })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiBearerAuth()
  @Auth()
  @Patch('store/:storeId/review/:id')
  async update(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser('id') userId: string,
  ): Promise<ReviewDto> {
    return this.reviewService.update(id, storeId, dto, userId);
  }

  @ApiOperation({ summary: 'Delete a review within a store' })
  @ApiOkResponse({ description: 'Review deleted successfully.', type: MessageResponseDto })
  @ApiNotFoundResponse({ description: 'Review not found.' })
  @ApiBearerAuth()
  @Auth()
  @Delete('store/:storeId/review/:id')
  async delete(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
    @CurrentUser('id') userId: string,
  ): Promise<MessageResponseDto> {
    return this.reviewService.delete(id, storeId, userId);
  }
}
