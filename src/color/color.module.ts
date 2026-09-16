import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorController } from './color.controller.js';
import { ColorService } from './color.service.js';
import { Color } from './entities/color.entity.js';
import { StoreModule } from '../store/store.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Color]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    StoreModule,
  ],
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
