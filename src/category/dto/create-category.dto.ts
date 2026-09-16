import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The title of the category',
    example: 'Electronics',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the category',
    example:
      'A category for electronic products such as phones, laptops, and accessories.',
  })
  @IsString()
  description: string;
}
