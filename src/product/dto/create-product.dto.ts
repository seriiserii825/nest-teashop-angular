import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'Green Tea',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the product (must be unique)',
    example: 'Loose-leaf green tea from Yunnan.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 250,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Image URLs of the product (at least one)',
    type: [String],
    example: ['/uploads/products/green-tea.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @ApiProperty({
    description: 'The id of the category (must belong to the same store)',
    format: 'uuid',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'The id of the color (must belong to the same store)',
    format: 'uuid',
  })
  @IsUUID()
  colorId: string;
}
