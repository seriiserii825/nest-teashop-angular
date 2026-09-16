import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({
    description: 'The name of the color (must be unique)',
    example: 'Red',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The value of the color',
    example: '#FF0000',
  })
  @IsString()
  @Matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/, {
    message: 'value must be a valid lowercase hex color (3 or 6 digits)',
  })
  value: string;
}
