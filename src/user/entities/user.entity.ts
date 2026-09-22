import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../order/entities/order.entity.js';
import { Product } from '../../product/entities/product.entity.js';
import { Review } from '../../review/entities/review.entity.js';
import { Store } from '../../store/entities/store.entity.js';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ default: '/uploads/no-user-image.jpg' })
  picture: string;

  @ApiProperty({ type: String, nullable: true })
  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @ApiProperty({ type: () => Store, isArray: true })
  @OneToMany(() => Store, (store) => store.user)
  stores: Relation<Store[]>;

  @ApiProperty({ type: () => Review, isArray: true })
  @OneToMany(() => Review, (review) => review.user)
  reviews: Relation<Review[]>;

  @ApiProperty({ type: () => Product, isArray: true })
  @ManyToMany(() => Product)
  @JoinTable({ name: 'user_favorites' })
  favorites: Relation<Product[]>;

  @ApiProperty({ type: () => Order, isArray: true })
  @OneToMany(() => Order, (order) => order.user, {
    cascade: true,
  })
  orders: Relation<Order[]>;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
