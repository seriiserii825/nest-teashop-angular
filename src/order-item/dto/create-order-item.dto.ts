import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'How many units of the product to order',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The id of the product',
    example: 'b3f1c2d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsString()
  productId: string;
}
