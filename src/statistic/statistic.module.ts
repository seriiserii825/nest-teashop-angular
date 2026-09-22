import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module.js';
import { OrderModule } from '../order/order.module.js';
import { ProductModule } from '../product/product.module.js';
import { ReviewModule } from '../review/review.module.js';
import { Statistic } from './entities/statistic.entity.js';
import { StatisticController } from './statistic.controller.js';
import { StatisticService } from './statistic.service.js';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports: [
    TypeOrmModule.forFeature([Statistic]),
    OrderModule,
    ProductModule,
    CategoryModule,
    ReviewModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class StatisticModule {}
