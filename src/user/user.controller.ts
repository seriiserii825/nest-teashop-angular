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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from './decorators/user.decorator.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';
import { UserDto } from './dto/user.dto.js';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({ description: 'The current user.', type: UserDto })
  @ApiBearerAuth()
  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string): Promise<UserDto> {
    const user = await this.userService.findOne(userId);
    return user;
  }

  @ApiOperation({ summary: 'Toggle a product in the current user favorites' })
  @ApiOkResponse({ description: 'The updated user.', type: UserDto })
  @ApiBearerAuth()
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ): Promise<UserDto> {
    return this.userService.toggleFavoriteProduct(userId, productId);
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ description: 'User created successfully.', type: UserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ description: 'List of users.', type: UserDto, isArray: true })
  @ApiBearerAuth()
  @Auth()
  @Get()
  findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Find a user by email' })
  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<UserDto | null> {
    return this.userService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Find a user by id' })
  @ApiOkResponse({
    description: 'User found successfully.',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
