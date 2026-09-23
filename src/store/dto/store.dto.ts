import { OmitType } from '@nestjs/swagger';
import { Store } from '../entities/store.entity.js';

export class StoreDto extends OmitType(Store, [
  'user',
  'categories',
  'colors',
  'order_items',
] as const) {}
