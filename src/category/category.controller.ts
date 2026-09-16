import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get('store/:storeId/category/:categoryId')
  getByStoreId(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoryService.getByStoreId(userId, storeId, categoryId);
  }

  @Auth()
  @Post('store/:storeId')
  create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(userId, storeId, createCategoryDto);
  }

  @Auth()
  @Get('store/:storeId')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.categoryService.findAll(userId, storeId);
  }

  @Auth()
  @Patch('store/:storeId/category/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(userId, storeId, id, updateCategoryDto);
  }

  @Auth()
  @Delete('store/:storeId/category/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ) {
    return this.categoryService.remove(userId, storeId, id);
  }
}
