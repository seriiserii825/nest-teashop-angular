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

export class MonthlySalesDto {
  @ApiProperty({ description: 'Month in "YYYY-MM" format.', example: '2026-09' })
  date: string;

  @ApiProperty({ description: 'Revenue for the month.', example: '1500' })
  value: string;
}

export class MiddleStatisticDto {
  @ApiProperty({ type: () => MonthlySalesDto, isArray: true })
  monthlySales: MonthlySalesDto[];

  @ApiProperty({ type: () => UserDto, isArray: true })
  latestUsers: UserDto[];
}
