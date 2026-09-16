import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ColorService } from './color.service.js';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Auth()
  @Get('store/:storeId/color/:colorId')
  getByStoreId(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('colorId') colorId: string,
  ) {
    return this.colorService.getByStoreId(userId, storeId, colorId);
  }

  @Auth()
  @Post('store/:storeId')
  create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() createColorDto: CreateColorDto,
  ) {
    return this.colorService.create(userId, storeId, createColorDto);
  }

  @Auth()
  @Get('store/:storeId')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ) {
    return this.colorService.findAll(userId, storeId);
  }

  @Auth()
  @Patch('store/:storeId/color/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.colorService.update(userId, storeId, id, updateColorDto);
  }

  @Auth()
  @Delete('store/:storeId/color/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ) {
    return this.colorService.remove(userId, storeId, id);
  }
}
