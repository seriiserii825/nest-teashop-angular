import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { Cart } from './entities/cart.entity.js';
import { CartItem } from './entities/cart-item.entity.js';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: { cart_items: { product: true } },
      order: { cart_items: { createdAt: 'ASC' } },
    });
    if (cart) {
      return cart;
    }

    const created = await this.cartRepository.save(
      this.cartRepository.create({ userId }),
    );
    return { ...created, cart_items: [] };
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productService.findOne(dto.productId);

    const existingItem = cart.cart_items.find(
      (item) => item.productId === product.id,
    );

    if (existingItem) {
      await this.cartItemRepository.update(existingItem.id, {
        quantity: existingItem.quantity + dto.quantity,
      });
    } else {
      await this.cartItemRepository.save(
        this.cartItemRepository.create({
          cartId: cart.id,
          productId: product.id,
          quantity: dto.quantity,
          price: product.price,
        }),
      );
    }

    return this.getOrCreateCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.cart_items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(`Cart item with id ${itemId} not found`);
    }

    await this.cartItemRepository.update(itemId, { quantity });
    return this.getOrCreateCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.cart_items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(`Cart item with id ${itemId} not found`);
    }

    await this.cartItemRepository.delete(itemId);
    return this.getOrCreateCart(userId);
  }

  async clear(userId: string): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
    return this.getOrCreateCart(userId);
  }
}
