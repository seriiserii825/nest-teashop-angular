import { hash } from 'argon2';
import { DataSource } from 'typeorm';
import AppDataSource from '../data-source.js';
import { Category } from '../category/entities/category.entity.js';
import { Color } from '../color/entities/color.entity.js';
import { Order } from '../order/entities/order.entity.js';
import { OrderItem } from '../order-item/entities/order-item.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { Review } from '../review/entities/review.entity.js';
import { Store } from '../store/entities/store.entity.js';
import { User } from '../user/entities/user.entity.js';

async function truncateAll(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.query(
    `TRUNCATE TABLE "user_favorites", "reviews", "order_items", "orders", "products", "colors", "categories", "stores", "users" RESTART IDENTITY CASCADE`,
  );
  await queryRunner.release();
}

async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);
  const password = await hash('password123');

  return repo.save([
    repo.create({ name: 'Serii', email: 'seriiburduja@gmail.com', password }),
    repo.create({ name: 'Nixon', email: 'nixon@gmail.com', password }),
    repo.create({ name: 'Buyer', email: 'buyer@example.com', password }),
  ]);
}

async function seedStores(dataSource: DataSource, users: User[]) {
  const repo = dataSource.getRepository(Store);

  return repo.save([
    repo.create({
      title: 'Serii Tea House',
      description: 'Loose leaf teas from around the world',
      userId: users[0].id,
    }),
    repo.create({
      title: 'Nixon Herbal Shop',
      description: 'Herbal blends and infusions',
      userId: users[1].id,
    }),
  ]);
}

async function seedCategories(dataSource: DataSource, stores: Store[]) {
  const repo = dataSource.getRepository(Category);

  return repo.save([
    repo.create({
      title: 'Green Tea',
      description: 'Fresh, lightly oxidized teas',
      storeId: stores[0].id,
    }),
    repo.create({
      title: 'Black Tea',
      description: 'Fully oxidized, bold teas',
      storeId: stores[0].id,
    }),
    repo.create({
      title: 'Herbal',
      description: 'Caffeine-free herbal infusions',
      storeId: stores[1].id,
    }),
  ]);
}

async function seedColors(dataSource: DataSource, stores: Store[]) {
  const repo = dataSource.getRepository(Color);

  return repo.save([
    repo.create({ name: 'Green', value: '#4caf50', storeId: stores[0].id }),
    repo.create({ name: 'Black', value: '#212121', storeId: stores[0].id }),
    repo.create({ name: 'Amber', value: '#ffb300', storeId: stores[1].id }),
  ]);
}

async function seedProducts(
  dataSource: DataSource,
  stores: Store[],
  categories: Category[],
  colors: Color[],
) {
  const repo = dataSource.getRepository(Product);

  return repo.save([
    repo.create({
      title: 'Sencha Green Tea',
      description: 'Classic Japanese green tea, grassy and fresh',
      price: 999,
      images: ['https://example.com/sencha.jpg'],
      storeId: stores[0].id,
      categoryId: categories[0].id,
      colorId: colors[0].id,
    }),
    repo.create({
      title: 'Earl Grey',
      description: 'Black tea with bergamot oil',
      price: 1150,
      images: ['https://example.com/earl-grey.jpg'],
      storeId: stores[0].id,
      categoryId: categories[1].id,
      colorId: colors[1].id,
    }),
    repo.create({
      title: 'Chamomile Blend',
      description: 'Soothing chamomile and honey herbal tea',
      price: 825,
      images: ['https://example.com/chamomile.jpg'],
      storeId: stores[1].id,
      categoryId: categories[2].id,
      colorId: colors[2].id,
    }),
  ]);
}

async function seedOrders(
  dataSource: DataSource,
  users: User[],
  stores: Store[],
  products: Product[],
) {
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);

  const order = await orderRepo.save(
    orderRepo.create({
      status: 'PAYED',
      total: products[0].price * 2 + products[1].price,
      userId: users[2].id,
    }),
  );

  await orderItemRepo.save([
    orderItemRepo.create({
      orderId: order.id,
      productId: products[0].id,
      storeId: stores[0].id,
      quantity: 2,
      price: products[0].price,
    }),
    orderItemRepo.create({
      orderId: order.id,
      productId: products[1].id,
      storeId: stores[0].id,
      quantity: 1,
      price: products[1].price,
    }),
  ]);

  return [order];
}

async function seedReviews(
  dataSource: DataSource,
  users: User[],
  stores: Store[],
  products: Product[],
) {
  const repo = dataSource.getRepository(Review);

  return repo.save([
    repo.create({
      text: 'Great flavor, will buy again!',
      rating: 5,
      userId: users[2].id,
      productId: products[0].id,
      storeId: stores[0].id,
    }),
    repo.create({
      text: 'Good but a bit pricey.',
      rating: 4,
      userId: users[2].id,
      productId: products[1].id,
      storeId: stores[0].id,
    }),
  ]);
}

async function seedFavorites(
  dataSource: DataSource,
  users: User[],
  products: Product[],
) {
  const repo = dataSource.getRepository(User);
  const buyer = await repo.findOneOrFail({
    where: { id: users[2].id },
    relations: { favorites: true },
  });
  buyer.favorites = [products[2]];
  await repo.save(buyer);
}

async function main() {
  await AppDataSource.initialize();

  try {
    await truncateAll(AppDataSource);

    const users = await seedUsers(AppDataSource);
    const stores = await seedStores(AppDataSource, users);
    const categories = await seedCategories(AppDataSource, stores);
    const colors = await seedColors(AppDataSource, stores);
    const products = await seedProducts(
      AppDataSource,
      stores,
      categories,
      colors,
    );
    await seedOrders(AppDataSource, users, stores, products);
    await seedReviews(AppDataSource, users, stores, products);
    await seedFavorites(AppDataSource, users, products);

    console.log('Seed complete:');
    console.log(`  users: ${users.length}`);
    console.log(`  stores: ${stores.length}`);
    console.log(`  categories: ${categories.length}`);
    console.log(`  colors: ${colors.length}`);
    console.log(`  products: ${products.length}`);
    console.log('Test accounts (password: password123):');
    for (const user of users) {
      console.log(`  ${user.email}`);
    }
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
