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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductService } from './product.service.js';
import { ProductDto } from './dto/product.dto.js';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'List products, optionally filtered by search term' })
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiOkResponse({ description: 'List of products.', type: ProductDto, isArray: true })
  @Get()
  async findAll(@Query('searchTerm') searchTerm?: string): Promise<ProductDto[]> {
    return this.productService.findAll(searchTerm);
  }

  @ApiOperation({ summary: 'List the most popular products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ description: 'List of products.', type: ProductDto, isArray: true })
  @Get('most-popular')
  async findByMostPopular(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<ProductDto[]> {
    return this.productService.findByMostPopular(limit);
  }

  @ApiOperation({ summary: 'List products by category' })
  @ApiOkResponse({ description: 'List of products.', type: ProductDto, isArray: true })
  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: string): Promise<ProductDto[]> {
    return this.productService.findByCategoryId(categoryId);
  }

  @ApiOperation({ summary: 'List products related to a product (same category)' })
  @ApiOkResponse({ description: 'List of products.', type: ProductDto, isArray: true })
  @Get('related/:productId')
  async findByRelatedCategory(@Param('productId') productId: string): Promise<ProductDto[]> {
    return this.productService.findByRelatedCategory(productId);
  }

  @ApiOperation({ summary: 'List products for a store' })
  @ApiOkResponse({ description: 'List of products.', type: ProductDto, isArray: true })
  @Get('store/:storeId')
  async findByStoreId(@Param('storeId') storeId: string): Promise<ProductDto[]> {
    return this.productService.findByStoreId(storeId);
  }

  @ApiOperation({ summary: 'Get a product by id' })
  @ApiOkResponse({ description: 'Product found successfully.', type: ProductDto })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a product for a store' })
  @ApiCreatedResponse({ description: 'Product created successfully.', type: ProductDto })
  @ApiBadRequestResponse({ description: 'A product with this description already exists.' })
  @ApiBearerAuth()
  @Auth()
  @Post('store/:storeId')
  async create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() dto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.create(userId, storeId, dto);
  }

  @ApiOperation({ summary: 'Update a product within a store' })
  @ApiOkResponse({ description: 'Product updated successfully.', type: ProductDto })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiBearerAuth()
  @Auth()
  @Patch('store/:storeId/product/:productId')
  async update(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productService.update(userId, storeId, productId, dto);
  }

  @ApiOperation({ summary: 'Delete a product within a store' })
  @ApiOkResponse({ description: 'Product deleted successfully.', type: String })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiBearerAuth()
  @Auth()
  @Delete('store/:storeId/product/:productId')
  async remove(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
  ): Promise<string> {
    return this.productService.delete(userId, storeId, productId);
  }
}
