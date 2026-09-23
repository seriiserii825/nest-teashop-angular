import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ColorService } from './color.service.js';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { ColorDto } from './dto/color.dto.js';
import { MessageResponseDto } from '../common/dto/message-response.dto.js';

@ApiTags('color')
@ApiBearerAuth()
@Auth()
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @ApiOperation({ summary: 'Get a color by id within a store' })
  @ApiOkResponse({ description: 'Color found successfully.', type: ColorDto })
  @ApiBadRequestResponse({ description: 'Color not found for this store.' })
  @Get('store/:storeId/color/:colorId')
  getByStoreId(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('colorId') colorId: string,
  ): Promise<ColorDto> {
    return this.colorService.getByStoreId(userId, storeId, colorId);
  }

  @ApiOperation({ summary: 'Create a color for a store' })
  @ApiCreatedResponse({ description: 'Color created successfully.', type: ColorDto })
  @ApiBadRequestResponse({ description: 'A color with this name already exists for this store.' })
  @Post('store/:storeId')
  create(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Body() createColorDto: CreateColorDto,
  ): Promise<ColorDto> {
    return this.colorService.create(userId, storeId, createColorDto);
  }

  @ApiOperation({ summary: 'List colors for a store' })
  @ApiOkResponse({ description: 'List of colors.', type: ColorDto, isArray: true })
  @Get('store/:storeId')
  findAll(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
  ): Promise<ColorDto[]> {
    return this.colorService.findAll(userId, storeId);
  }

  @ApiOperation({ summary: 'Update a color within a store' })
  @ApiOkResponse({ description: 'Color updated successfully.', type: ColorDto })
  @ApiBadRequestResponse({ description: 'Color not found for this store.' })
  @Patch('store/:storeId/color/:id')
  update(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<ColorDto | null> {
    return this.colorService.update(userId, storeId, id, updateColorDto);
  }

  @ApiOperation({ summary: 'Delete a color within a store' })
  @ApiOkResponse({ description: 'Color deleted successfully.', type: MessageResponseDto })
  @ApiBadRequestResponse({ description: 'Color not found for this store.' })
  @Delete('store/:storeId/color/:id')
  remove(
    @CurrentUser('id') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ): Promise<MessageResponseDto> {
    return this.colorService.remove(userId, storeId, id);
  }
}
