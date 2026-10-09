import { OmitType } from '@nestjs/swagger';
import { CartItem } from '../entities/cart-item.entity.js';

export class CartItemDto extends OmitType(CartItem, ['cart'] as const) {}
