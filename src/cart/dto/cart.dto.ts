import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Cart } from '../entities/cart.entity.js';
import { CartItemDto } from './cart-item.dto.js';

export class CartDto extends OmitType(Cart, ['user', 'cart_items'] as const) {
  @ApiProperty({ type: () => CartItemDto, isArray: true })
  cart_items: CartItemDto[];
}
