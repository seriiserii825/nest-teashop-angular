import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ColorService } from './color.service.js';
import { CreateColorDto } from './dto/create-color.dto.js';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('store/:storeId/color/:colorId')
  getByStoreId(
    @Param('storeId') storeId: string,
    @Param('colorId') colorId: string,
  ) {
    return this.colorService.getByStoreId(storeId, colorId);
  }

  @Post('store/:storeId')
  create(
    @Param('storeId') storeId: string,
    @Body() createColorDto: CreateColorDto,
  ) {
    return this.colorService.create(storeId, createColorDto);
  }

  @Get()
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
  //   return this.colorService.update(+id, updateColorDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.colorService.remove(+id);
  // }
}
