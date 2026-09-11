import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module.js';
import { StoreModule } from './store/store.module.js';
import { databaseConfig } from './database.config.js';
import { ProductModule } from './product/product.module.js';
import { CategoryModule } from './category/category.module.js';
import { ColorModule } from './color/color.module.js';
import { ReviewModule } from './review/review.module.js';
import { OrderModule } from './order/order.module.js';
import { OrderItemModule } from './order-item/order-item.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      autoLoadEntities: true,
    }),
    UserModule,
    StoreModule,
    ProductModule,
    CategoryModule,
    ColorModule,
    ReviewModule,
    OrderModule,
    OrderItemModule,
  ],
})
export class AppModule {}
