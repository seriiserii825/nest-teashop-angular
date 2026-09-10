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
import type { Relation } from 'typeorm';
import { User } from '../../user/entities/user.entity.js';
import { Product } from '../../product/entities/product.entity.js';
import { Category } from '../../category/entities/category.entity.js';
import { Color } from '../../color/entities/color.entity.js';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  description: string;

  @ManyToOne(() => User, (user) => user.stores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

  @Column()
  userId: string;

  @OneToMany(() => Product, (product) => product.store)
  products: Relation<Product[]>;

  @OneToMany(() => Category, (category) => category.store)
  categories: Relation<Category[]>;

  @OneToMany(() => Color, (color) => color.store)
  colors: Relation<Color[]>;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
