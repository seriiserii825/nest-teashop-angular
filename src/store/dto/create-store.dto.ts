import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'The title of the store',
    example: 'My Store',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @ApiProperty({
    description: 'The description of the store',
    example: 'This is my store where I sell amazing products.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Description should not be empty' })
  description: string;
}
