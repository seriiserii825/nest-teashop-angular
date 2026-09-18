import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductService } from './product.service.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query('searchTerm') searchTerm?: string) {
    return this.productService.findAll(searchTerm);
  }

  @Get('most-popular')
  async findByMostPopular(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.productService.findByMostPopular(limit);
  }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.productService.findByCategoryId(categoryId);
  }

  @Get('related/:productId')
  async findByRelatedCategory(@Param('productId') productId: string) {
    return this.productService.findByRelatedCategory(productId);
  }

  @Get('store/:storeId')
  async findByStoreId(@Param('storeId') storeId: string) {
    return this.productService.findByStoreId(storeId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Auth()
  @Post('store/:storeId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(userId, storeId, dto);
  }

  @Auth()
  @Patch('store/:storeId/product/:productId')
  async update(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(userId, storeId, productId, dto);
  }

  @Auth()
  @Delete('store/:storeId/product/:productId')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.delete(userId, storeId, productId);
  }
}
