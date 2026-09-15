import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { UpdateStoreDto } from './dto/update-store.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Auth()
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(userId, createStoreDto);
  }

  @Auth()
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(userId, storeId, updateStoreDto);
  }

  @Auth()
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') storeId: string) {
    return this.storeService.remove(userId, storeId);
  }

  @Auth()
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') storeId: string) {
    return this.storeService.findOne(storeId, userId);
  }

  @Auth()
  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.storeService.findAll(userId);
  }
}
