import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { StatisticService } from './statistic.service.js';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Auth()
  @Get('main/store/:storeId')
  async getMainStatistic(@Param('storeId') storeId: string) {
    return this.statisticService.getMainStatistic(storeId);
  }

  @Auth()
  @Get('middle/store/:storeId')
  async getMiddleStatistics(@Param('storeId') storeId: string) {
    return this.statisticService.getMiddleStatistics(storeId);
  }
}
