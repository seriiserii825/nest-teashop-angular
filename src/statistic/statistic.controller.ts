import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { StatisticService } from './statistic.service.js';
import {
  MainStatisticDto,
  MiddleStatisticDto,
} from './dto/statistic-response.dto.js';

@ApiTags('statistic')
@ApiBearerAuth()
@Auth()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @ApiOperation({ summary: 'Get main statistics for a store (revenue, products, categories, rating)' })
  @ApiOkResponse({
    description: 'Main statistics.',
    type: MainStatisticDto,
    isArray: true,
  })
  @Get('main/store/:storeId')
  async getMainStatistic(@Param('storeId') storeId: string): Promise<MainStatisticDto[]> {
    return this.statisticService.getMainStatistic(storeId);
  }

  @ApiOperation({ summary: 'Get middle statistics for a store (monthly sales, latest users)' })
  @ApiOkResponse({
    description: 'Middle statistics.',
    type: MiddleStatisticDto,
  })
  @Get('middle/store/:storeId')
  async getMiddleStatistics(@Param('storeId') storeId: string): Promise<MiddleStatisticDto> {
    return this.statisticService.getMiddleStatistics(storeId);
  }
}
