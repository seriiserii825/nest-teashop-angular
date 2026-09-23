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
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { OrderService } from './order.service.js';
import { OrderDto } from './dto/order.dto.js';

@ApiTags('order')
@ApiBearerAuth()
@Auth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create an order for the current user' })
  @ApiCreatedResponse({ description: 'Order created successfully.', type: OrderDto })
  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    return this.orderService.create(createOrderDto, userId);
  }

  @ApiOperation({ summary: "List the current user's orders" })
  @ApiOkResponse({ description: 'List of orders.', type: OrderDto, isArray: true })
  @Get()
  findAll(@CurrentUser('id') userId: string): Promise<OrderDto[]> {
    return this.orderService.findAll(userId);
  }

  @ApiOperation({ summary: 'Get an order owned by the current user' })
  @ApiOkResponse({ description: 'Order found successfully.', type: OrderDto })
  @ApiNotFoundResponse({ description: 'Order not found.' })
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string): Promise<OrderDto> {
    return this.orderService.findOne(id, userId);
  }

  @ApiOperation({ summary: 'Update an order owned by the current user' })
  @ApiOkResponse({ description: 'Order updated successfully.', type: OrderDto })
  @ApiNotFoundResponse({ description: 'Order not found.' })
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDto> {
    return this.orderService.update(id, userId, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete an order owned by the current user' })
  @ApiOkResponse({ description: 'Order deleted successfully.', type: OrderDto })
  @ApiNotFoundResponse({ description: 'Order not found.' })
  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string): Promise<OrderDto> {
    return this.orderService.remove(id, userId);
  }
}
