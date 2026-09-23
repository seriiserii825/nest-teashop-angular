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
import { StoreDto } from './dto/store.dto.js';

@ApiTags('store')
@ApiBearerAuth()
@Auth()
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({ summary: 'Create a store for the current user' })
  @ApiCreatedResponse({ description: 'Store created successfully.', type: StoreDto })
  @ApiBadRequestResponse({ description: 'A store with this title already exists for this user.' })
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<StoreDto> {
    return this.storeService.create(userId, createStoreDto);
  }

  @ApiOperation({ summary: 'Update a store owned by the current user' })
  @ApiOkResponse({ description: 'Store updated successfully.', type: StoreDto })
  @ApiNotFoundResponse({ description: 'Store not found, or you are not the owner.' })
  @ApiBadRequestResponse({ description: 'A store with this title already exists for this user.' })
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') storeId: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<StoreDto> {
    return this.storeService.update(userId, storeId, updateStoreDto);
  }

  @ApiOperation({ summary: 'Delete a store owned by the current user' })
  @ApiOkResponse({ description: 'Store deleted successfully.', type: StoreDto })
  @ApiNotFoundResponse({ description: 'Store not found, or you are not the owner.' })
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') storeId: string): Promise<StoreDto> {
    return this.storeService.remove(userId, storeId);
  }

  @ApiOperation({ summary: 'Get a store owned by the current user' })
  @ApiOkResponse({ description: 'Store found successfully.', type: StoreDto })
  @ApiNotFoundResponse({ description: 'Store not found, or you are not the owner.' })
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') storeId: string): Promise<StoreDto> {
    return this.storeService.findOne(storeId, userId);
  }

  @ApiOperation({ summary: "List the current user's stores" })
  @ApiOkResponse({ description: 'List of stores.', type: StoreDto, isArray: true })
  @Get()
  findAll(@CurrentUser('id') userId: string): Promise<StoreDto[]> {
    return this.storeService.findAll(userId);
  }
}
