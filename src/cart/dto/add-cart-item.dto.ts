import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'The id of the product to add',
    example: 'b3f1c2d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'How many units of the product to add',
    example: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
