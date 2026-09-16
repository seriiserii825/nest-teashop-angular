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
import type { Relation } from 'typeorm';
import { Product } from '../../product/entities/product.entity.js';
import { Store } from '../../store/entities/store.entity.js';

@Entity('colors')
@Unique(['storeId', 'name'])
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @OneToMany(() => Product, (product) => product.color)
  products: Relation<Product[]>;

  @ManyToOne(() => Store, (store) => store.colors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Relation<Store>;

  @Column()
  storeId: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
