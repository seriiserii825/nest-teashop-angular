import { OmitType } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity.js';

export class OrderItemDto extends OmitType(OrderItem, ['order'] as const) {}
