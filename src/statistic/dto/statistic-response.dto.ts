import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto.js';

export class MainStatisticDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Total Revenue' })
  name: string;

  @ApiProperty({ example: 1500 })
  value: number;
}

export class MiddleStatisticDto {
  @ApiProperty({
    description: 'Revenue per month, keyed by "YYYY-M".',
    type: 'object',
    additionalProperties: { type: 'number' },
    example: { '2026-9': 1500 },
  })
  monthlySales: Record<string, number>;

  @ApiProperty({ type: () => UserDto, isArray: true })
  latestUsers: UserDto[];
}
