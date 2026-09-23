import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ example: '/uploads/products/1727000000000-tea.jpg' })
  url: string;

  @ApiProperty({ example: '1727000000000-tea.jpg' })
  name: string;
}
