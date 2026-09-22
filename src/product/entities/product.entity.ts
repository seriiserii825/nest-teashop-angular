import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity.js';
import { Color } from '../../color/entities/color.entity.js';
import { OrderItem } from '../../order-item/entities/order-item.entity.js';
import { Review } from '../../review/entities/review.entity.js';
import { Store } from '../../store/entities/store.entity.js';
import { User } from '../../user/entities/user.entity.js';

@Entity('products')
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ unique: true })
  description: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty({ type: [String] })
  @Column('simple-array')
  images: string[];

  @ApiProperty({ type: () => Store })
  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Relation<Store>;

  @ApiProperty()
  @Column()
  storeId: string;

  @ApiProperty({ type: () => Category })
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>;

  @ApiProperty()
  @Column()
  categoryId: string;

  @ApiProperty({ type: () => Color })
  @ManyToOne(() => Color, (color) => color.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'colorId' })
  color: Relation<Color>;

  @ApiProperty()
  @Column()
  colorId: string;

  @ApiProperty({ type: () => Review, isArray: true })
  @OneToMany(() => Review, (review) => review.product)
  reviews: Relation<Review[]>;

  @ApiProperty({ type: () => OrderItem, isArray: true })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, {
    cascade: true,
  })
  order_items: Relation<OrderItem[]>;

  @ApiProperty({ type: () => User, isArray: true })
  @ManyToMany(() => User, (user) => user.favorites)
  users: Relation<User[]>;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
