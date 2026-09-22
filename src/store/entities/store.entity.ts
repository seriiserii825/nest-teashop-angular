import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity.js';
import { Color } from '../../color/entities/color.entity.js';
import { OrderItem } from '../../order-item/entities/order-item.entity.js';
import { Product } from '../../product/entities/product.entity.js';
import { Review } from '../../review/entities/review.entity.js';
import { User } from '../../user/entities/user.entity.js';

@Entity('stores')
@Unique(['userId', 'title'])
export class Store {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty({ type: () => Product, isArray: true })
  @OneToMany(() => Product, (product) => product.store)
  products: Relation<Product[]>;

  @ApiProperty({ type: () => Category, isArray: true })
  @OneToMany(() => Category, (category) => category.store)
  categories: Relation<Category[]>;

  @ApiProperty({ type: () => Color, isArray: true })
  @OneToMany(() => Color, (color) => color.store)
  colors: Relation<Color[]>;

  @ApiProperty({ type: () => Review, isArray: true })
  @OneToMany(() => Review, (review) => review.store)
  reviews: Relation<Review[]>;

  @ApiProperty({ type: () => OrderItem, isArray: true })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, {
    cascade: true,
  })
  order_items: Relation<OrderItem[]>;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
