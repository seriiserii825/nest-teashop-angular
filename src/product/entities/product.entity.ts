import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity.js';
import { Color } from '../../color/entities/color.entity.js';
import { OrderItem } from '../../order-item/entities/order-item.entity.js';
import { Review } from '../../review/entities/review.entity.js';
import { Store } from '../../store/entities/store.entity.js';
import { User } from '../../user/entities/user.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  description: string;

  @Column()
  price: number;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Relation<Store>;

  @Column()
  storeId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Relation<Category>;

  @Column()
  categoryId: string;

  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column()
  userId: string;

  @ManyToOne(() => Color, (color) => color.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'colorId' })
  color: Relation<Color>;

  @Column()
  colorId: string;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Relation<Review[]>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderId, {
    cascade: true,
  })
  order_items: Relation<OrderItem[]>;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
