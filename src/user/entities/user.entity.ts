import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Store } from '../../store/entities/store.entity.js';
import { Review } from '../../review/entities/review.entity.js';
import { Product } from '../../product/entities/product.entity.js';

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

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
