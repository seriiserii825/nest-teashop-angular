import { IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsString()
  productId: string;

  @IsString()
  storeId: string;
}
