import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity.js';
import { Cart } from './cart.entity.js';

@Entity('cart_items')
export class CartItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Cart })
  @ManyToOne(() => Cart, (cart) => cart.cart_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Relation<Cart>;

  @ApiProperty()
  @Column()
  cartId: string;

  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @ApiProperty()
  @Column()
  productId: string;

  @ApiProperty()
  @Column()
  quantity: number;

  // Цена фиксируется в момент добавления в корзину — последующее изменение цены
  // товара в каталоге не должно задним числом менять то, что уже лежит в корзине
  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
