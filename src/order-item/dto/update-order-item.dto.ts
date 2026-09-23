import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto.js';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
