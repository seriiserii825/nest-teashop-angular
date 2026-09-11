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
import { Order } from '../../order/entities/order.entity.js';
import { Product } from '../../product/entities/product.entity.js';
import { Store } from '../../store/entities/store.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.order_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Relation<Order>;

  @Column()
  orderId: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Product, (product) => product.order_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @ManyToOne(() => Store, (store) => store.order_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Relation<Store>;

  @Column()
  storeId: string;

  @Column()
  productId: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
