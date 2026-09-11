import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service.js';
import { OrderItemController } from './order-item.controller.js';

@Module({
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
