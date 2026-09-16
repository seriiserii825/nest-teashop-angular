import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from '../store/store.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storeService: StoreService,
  ) {}

  async getByStoreId(
    userId: string,
    storeId: string,
    categoryId: string,
  ): Promise<Category> {
    await this.storeService.findOne(storeId, userId);
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, storeId },
      relations: { store: true },
    });
    if (!category) {
      throw new BadRequestException(
        `Category with id ${categoryId} not found for store ${storeId}`,
      );
    }
    return category;
  }

  async create(userId: string, storeId: string, dto: CreateCategoryDto) {
    await this.storeService.findOne(storeId, userId);
    const existingCategory = await this.categoryRepository.findOne({
      where: { storeId, title: dto.title },
    });
    if (existingCategory) {
      throw new BadRequestException(
        `Category with name ${dto.title} already exists for this store`,
      );
    }
    const category = this.categoryRepository.create({ ...dto, storeId });
    return this.categoryRepository.save(category);
  }

  async findAll(userId: string, storeId: string) {
    await this.storeService.findOne(storeId, userId);
    return this.categoryRepository.find({
      where: { storeId },
      relations: { store: true },
    });
  }

  async update(
    userId: string,
    storeId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ) {
    await this.storeService.findOne(storeId, userId);
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, storeId },
    });
    if (!category) {
      throw new BadRequestException(
        `Category with id ${categoryId} not found for store ${storeId}`,
      );
    }
    await this.categoryRepository.update({ id: categoryId, storeId }, dto);
    return this.categoryRepository.findOne({
      where: { id: categoryId, storeId },
      relations: { store: true },
    });
  }

  async remove(userId: string, storeId: string, categoryId: string) {
    await this.storeService.findOne(storeId, userId);
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, storeId },
    });
    if (!category) {
      throw new BadRequestException(
        `Category with id ${categoryId} not found for store ${storeId}`,
      );
    }
    await this.categoryRepository.delete({ id: categoryId, storeId });
    return { message: `Category with id ${categoryId} deleted successfully` };
  }
}
