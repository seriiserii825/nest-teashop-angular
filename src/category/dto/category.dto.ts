import { OmitType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity.js';

export class CategoryDto extends OmitType(Category, ['products'] as const) {}
