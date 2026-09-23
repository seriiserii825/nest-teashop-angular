import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StoreService } from './store.service.js';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { UpdateStoreDto } from './dto/update-store.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { Store } from './entities/store.entity.js';

@ApiTags('store')
@ApiBearerAuth()
@Auth()
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({ summary: 'Create a store for the current user' })
  @ApiCreatedResponse({ description: 'Store created successfully.', type: Store })
  @ApiBadRequestResponse({ description: 'A store with this title already exists for this user.' })
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    return this.storeService.create(userId, createStoreDto);
  }

  @ApiOperation({ summary: 'Update a store owned by the current user' })
  @ApiOkResponse({ description: 'Store updated successfully.', type: Store })
  @ApiNotFoundResponse({ description: 'Store not found, or you are not the owner.' })
  @ApiBadRequestResponse({ description: 'A store with this title already exists for this user.' })
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.update(userId, storeId, updateStoreDto);
  }

  @ApiOperation({ summary: 'Delete a store owned by the current user' })
  @ApiOkResponse({ description: 'Store deleted successfully.', type: Store })
  @ApiNotFoundResponse({ description: 'Store not found, or you are not the owner.' })
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') storeId: string) {
    return this.storeService.remove(userId, storeId);
  }

  @ApiOperation({ summary: 'Get a store owned by the current user' })
  @ApiOkResponse({ description: 'Store found successfully.', type: Store })
  @ApiNotFoundResponse({ description: 'Store not found, or you are not the owner.' })
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') storeId: string) {
    return this.storeService.findOne(storeId, userId);
  }

  @ApiOperation({ summary: "List the current user's stores" })
  @ApiOkResponse({ description: 'List of stores.', type: Store, isArray: true })
  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.storeService.findAll(userId);
  }
}
