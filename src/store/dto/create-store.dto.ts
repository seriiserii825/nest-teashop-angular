import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'The title of the store',
    example: 'My Store',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the store',
    example: 'This is my store where I sell amazing products.',
  })
  @IsString()
  description: string;
}
