import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';
import { StoreModule } from '../store/store.module.js';
import { CategoryModule } from '../category/category.module.js';
import { ColorModule } from '../color/color.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    StoreModule,
    CategoryModule,
    ColorModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
