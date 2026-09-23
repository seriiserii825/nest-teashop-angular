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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';

@ApiTags('category')
@ApiBearerAuth()
@Auth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get a category by id within a store' })
  @ApiOkResponse({ description: 'Category found successfully.', type: Category })
  @ApiBadRequestResponse({ description: 'Category not found for this store.' })
  @Get('store/:storeId/category/:categoryId')
  getByStoreId(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryService.getByStoreId(userId, storeId, categoryId);
  }

  @ApiOperation({ summary: 'Create a category for a store' })
  @ApiCreatedResponse({ description: 'Category created successfully.', type: Category })
  @ApiBadRequestResponse({ description: 'A category with this title already exists for this store.' })
  @Post('store/:storeId')
  create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(userId, storeId, createCategoryDto);
  }

  @ApiOperation({ summary: 'List categories for a store' })
  @ApiOkResponse({ description: 'List of categories.', type: Category, isArray: true })
  @Get('store/:storeId')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.categoryService.findAll(userId, storeId);
  }

  @ApiOperation({ summary: 'Update a category within a store' })
  @ApiOkResponse({ description: 'Category updated successfully.', type: Category })
  @ApiBadRequestResponse({ description: 'Category not found for this store.' })
  @Patch('store/:storeId/category/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(userId, storeId, id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category within a store' })
  @ApiOkResponse({ description: 'Category deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Category not found for this store.' })
  @Delete('store/:storeId/category/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ) {
    return this.categoryService.remove(userId, storeId, id);
  }
}
