import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CurrentUser } from '../user/decorators/user.decorator.js';
import { CartService } from './cart.service.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { CartDto } from './dto/cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';

@ApiTags('cart')
@ApiBearerAuth()
@Auth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: "Get the current user's cart" })
  @ApiOkResponse({ description: 'The current cart.', type: CartDto })
  @Get()
  getCart(@CurrentUser('id') userId: string): Promise<CartDto> {
    return this.cartService.getOrCreateCart(userId);
  }

  @ApiOperation({ summary: 'Add a product to the current cart' })
  @ApiOkResponse({ description: 'The updated cart.', type: CartDto })
  @Post('items')
  addItem(
    @CurrentUser('id') userId: string,
    @Body() dto: AddCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.addItem(userId, dto);
  }

  @ApiOperation({ summary: 'Update the quantity of a cart item' })
  @ApiOkResponse({ description: 'The updated cart.', type: CartDto })
  @ApiNotFoundResponse({ description: 'Cart item not found.' })
  @Patch('items/:itemId')
  updateItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartDto> {
    return this.cartService.updateItemQuantity(userId, itemId, dto.quantity);
  }

  @ApiOperation({ summary: 'Remove an item from the current cart' })
  @ApiOkResponse({ description: 'The updated cart.', type: CartDto })
  @ApiNotFoundResponse({ description: 'Cart item not found.' })
  @Delete('items/:itemId')
  removeItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<CartDto> {
    return this.cartService.removeItem(userId, itemId);
  }

  @ApiOperation({ summary: 'Remove all items from the current cart' })
  @ApiOkResponse({ description: 'The emptied cart.', type: CartDto })
  @Delete()
  clear(@CurrentUser('id') userId: string): Promise<CartDto> {
    return this.cartService.clear(userId);
  }
}
