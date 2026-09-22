import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from '../../order-item/dto/create-order-item.dto.js';
import { OrderStatus } from '../enums/order-status.enum.js';

export class CreateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsArray({
    message: 'Items must be an array of objects with productId and quantity',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
