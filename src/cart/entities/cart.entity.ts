import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity.js';
import { CartItem } from './cart-item.entity.js';

@Entity('carts')
export class Cart {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ApiProperty()
  @Column({ unique: true })
  userId: string;

  @ApiProperty({ type: () => CartItem, isArray: true })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  cart_items: Relation<CartItem[]>;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
