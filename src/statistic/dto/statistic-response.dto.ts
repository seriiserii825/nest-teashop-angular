import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto.js';

export class MainStatisticDto {
  @ApiProperty({ description: 'Sum of all order totals.', example: 1500 })
  totalRevenue: number;

  @ApiProperty({ example: 42 })
  productsCount: number;

  @ApiProperty({ example: 5 })
  categoriesCount: number;

  @ApiProperty({ description: 'Average review rating.', example: 4.5 })
  averageRating: number;
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
