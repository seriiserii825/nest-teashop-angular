import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service.js';
import { StatisticController } from './statistic.controller.js';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
