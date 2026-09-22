import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Auth()
  @Get('main/store/:storeId')
  async getMainStatistic(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.statisticService.getMainStatistic(userId, storeId);
  }

  @Auth()
  @Get('middle/store/:storeId')
  async getMiddleStatistics(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.statisticService.getMiddleStatistics(userId, storeId);
  }
}
