import { OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity.js';

export class ProductDto extends OmitType(Product, [
  'order_items',
  'users',
] as const) {}
