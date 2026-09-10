import { Module } from '@nestjs/common';
import { ColorService } from './color.service.js';
import { ColorController } from './color.controller.js';

@Module({
  controllers: [ColorController],
  providers: [ColorService],
})
export class ColorModule {}
