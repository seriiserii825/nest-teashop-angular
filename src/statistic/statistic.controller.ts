import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatisticService } from './statistic.service.js';
import { CreateStatisticDto } from './dto/create-statistic.dto.js';
import { UpdateStatisticDto } from './dto/update-statistic.dto.js';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Post()
  create(@Body() createStatisticDto: CreateStatisticDto) {
    return this.statisticService.create(createStatisticDto);
  }

  @Get()
  findAll() {
    return this.statisticService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statisticService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatisticDto: UpdateStatisticDto) {
    return this.statisticService.update(+id, updateStatisticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statisticService.remove(+id);
  }
}
