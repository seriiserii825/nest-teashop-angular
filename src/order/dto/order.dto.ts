import { ApiProperty, OmitType } from '@nestjs/swagger';
import { OrderItemDto } from '../../order-item/dto/order-item.dto.js';
import { Order } from '../entities/order.entity.js';

export class OrderDto extends OmitType(Order, [
  'user',
  'order_items',
] as const) {
  @ApiProperty({ type: () => OrderItemDto, isArray: true })
  order_items: OrderItemDto[];
}
