import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity.js';
import { Product } from '../../product/entities/product.entity.js';
import { Review } from '../../review/entities/review.entity.js';
import { Store } from '../../store/entities/store.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: '/uploads/no-user-image.jpg' })
  picture: string;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @OneToMany(() => Store, (store) => store.user)
  stores: Relation<Store[]>;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review[]>;

  @OneToMany(() => Product, (product) => product.user)
  favorites: Relation<Product[]>;

  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Relation<Order[]>;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
