import { hash } from 'argon2';
import { DataSource } from 'typeorm';
import AppDataSource from '../data-source.js';
import { Category } from '../category/entities/category.entity.js';
import { Color } from '../color/entities/color.entity.js';
import { Order } from '../order/entities/order.entity.js';
import { OrderStatus } from '../order/enums/order-status.enum.js';
import { OrderItem } from '../order-item/entities/order-item.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { Review } from '../review/entities/review.entity.js';
import { Store } from '../store/entities/store.entity.js';
import { User } from '../user/entities/user.entity.js';

interface ProductSeed {
  title: string;
  description: string;
  price: number;
  image: string;
  category: number;
  color: number;
}

interface StoreSeed {
  title: string;
  description: string;
  categories: { title: string; description: string }[];
  colors: { name: string; value: string }[];
  products: ProductSeed[];
}

// Indexed by user: STORES_BY_USER[i] are the stores owned by users[i].
const STORES_BY_USER: StoreSeed[][] = [
  [
    {
      title: 'Serii Tea House',
      description: 'Loose leaf teas from around the world',
      categories: [
        { title: 'Green Tea', description: 'Fresh, lightly oxidized teas' },
        { title: 'Black Tea', description: 'Fully oxidized, bold teas' },
      ],
      colors: [
        { name: 'Green', value: '#4caf50' },
        { name: 'Black', value: '#212121' },
      ],
      products: [
        {
          title: 'Sencha Green Tea',
          description: 'Classic Japanese green tea, grassy and fresh',
          price: 999,
          image: 'sencha',
          category: 0,
          color: 0,
        },
        {
          title: 'Gyokuro',
          description: 'Shade-grown Japanese green tea with deep umami',
          price: 2450,
          image: 'gyokuro',
          category: 0,
          color: 0,
        },
        {
          title: 'Earl Grey',
          description: 'Black tea with bergamot oil',
          price: 1150,
          image: 'earl-grey',
          category: 1,
          color: 1,
        },
        {
          title: 'English Breakfast',
          description: 'Robust blend of Assam and Ceylon black teas',
          price: 890,
          image: 'english-breakfast',
          category: 1,
          color: 1,
        },
      ],
    },
    {
      title: 'Serii Oolong Corner',
      description: 'Hand-picked oolongs from Taiwan and Fujian',
      categories: [
        {
          title: 'Light Oolong',
          description: 'Floral, lightly roasted oolongs',
        },
        {
          title: 'Dark Oolong',
          description: 'Roasted, rich and mineral oolongs',
        },
      ],
      colors: [
        { name: 'Jade', value: '#00a86b' },
        { name: 'Brown', value: '#795548' },
      ],
      products: [
        {
          title: 'Tie Guan Yin',
          description: 'Iron Goddess oolong with orchid aroma',
          price: 1690,
          image: 'tie-guan-yin',
          category: 0,
          color: 0,
        },
        {
          title: 'Alishan High Mountain',
          description: 'Creamy high-altitude Taiwanese oolong',
          price: 2190,
          image: 'alishan',
          category: 0,
          color: 0,
        },
        {
          title: 'Da Hong Pao',
          description: 'Big Red Robe rock oolong from Wuyi mountains',
          price: 2790,
          image: 'da-hong-pao',
          category: 1,
          color: 1,
        },
      ],
    },
  ],
  [
    {
      title: 'Nixon Herbal Shop',
      description: 'Herbal blends and infusions',
      categories: [
        { title: 'Herbal', description: 'Caffeine-free herbal infusions' },
        { title: 'Fruit', description: 'Dried fruit and berry blends' },
      ],
      colors: [
        { name: 'Amber', value: '#ffb300' },
        { name: 'Red', value: '#e53935' },
      ],
      products: [
        {
          title: 'Chamomile Blend',
          description: 'Soothing chamomile and honey herbal tea',
          price: 825,
          image: 'chamomile',
          category: 0,
          color: 0,
        },
        {
          title: 'Peppermint Leaf',
          description: 'Cooling whole peppermint leaves',
          price: 750,
          image: 'peppermint',
          category: 0,
          color: 0,
        },
        {
          title: 'Berry Burst',
          description: 'Hibiscus, raspberry and blackcurrant infusion',
          price: 950,
          image: 'berry-burst',
          category: 1,
          color: 1,
        },
      ],
    },
    {
      title: 'Nixon Matcha Bar',
      description: 'Ceremonial and culinary grade matcha',
      categories: [
        {
          title: 'Ceremonial',
          description: 'Stone-ground matcha for whisking',
        },
        { title: 'Culinary', description: 'Matcha for lattes and baking' },
      ],
      colors: [
        { name: 'Emerald', value: '#2e7d32' },
        { name: 'Olive', value: '#827717' },
      ],
      products: [
        {
          title: 'Uji Ceremonial Matcha',
          description: 'Vibrant first-harvest matcha from Uji, Kyoto',
          price: 3290,
          image: 'uji-matcha',
          category: 0,
          color: 0,
        },
        {
          title: 'Latte Matcha',
          description: 'Bold matcha blend made for milk drinks',
          price: 1590,
          image: 'latte-matcha',
          category: 1,
          color: 1,
        },
        {
          title: 'Baking Matcha',
          description: 'Economical matcha powder for desserts',
          price: 1190,
          image: 'baking-matcha',
          category: 1,
          color: 1,
        },
      ],
    },
  ],
  [
    {
      title: 'Buyer Chai Corner',
      description: 'Spiced chai blends inspired by India',
      categories: [
        { title: 'Masala Chai', description: 'Black tea with warming spices' },
        { title: 'Rooibos Chai', description: 'Caffeine-free spiced rooibos' },
      ],
      colors: [
        { name: 'Cinnamon', value: '#d2691e' },
        { name: 'Rust', value: '#b7410e' },
      ],
      products: [
        {
          title: 'Classic Masala Chai',
          description: 'Assam with cardamom, ginger and clove',
          price: 990,
          image: 'masala-chai',
          category: 0,
          color: 0,
        },
        {
          title: 'Vanilla Chai',
          description: 'Masala chai softened with Madagascar vanilla',
          price: 1090,
          image: 'vanilla-chai',
          category: 0,
          color: 0,
        },
        {
          title: 'Rooibos Chai',
          description: 'South African rooibos with chai spices',
          price: 870,
          image: 'rooibos-chai',
          category: 1,
          color: 1,
        },
      ],
    },
    {
      title: 'Buyer Pu-erh Cellar',
      description: 'Aged and fermented teas from Yunnan',
      categories: [
        {
          title: 'Sheng Pu-erh',
          description: 'Raw pu-erh, bright and evolving',
        },
        { title: 'Shou Pu-erh', description: 'Ripe pu-erh, earthy and smooth' },
      ],
      colors: [
        { name: 'Gold', value: '#c9a227' },
        { name: 'Dark Brown', value: '#3e2723' },
      ],
      products: [
        {
          title: 'Menghai Sheng 2018',
          description: 'Raw pu-erh cake from Menghai, pressed in 2018',
          price: 3890,
          image: 'menghai-sheng',
          category: 0,
          color: 0,
        },
        {
          title: 'Ripe Mini Tuocha',
          description: 'Single-serve ripe pu-erh nests',
          price: 1290,
          image: 'mini-tuocha',
          category: 1,
          color: 1,
        },
        {
          title: 'Palace Shou Pu-erh',
          description: 'Fine-leaf ripe pu-erh with chocolate notes',
          price: 2190,
          image: 'palace-shou',
          category: 1,
          color: 1,
        },
      ],
    },
  ],
];

const REVIEW_TEXTS: { text: string; rating: number }[] = [
  { text: 'Great flavor, will buy again!', rating: 5 },
  { text: 'Nice notes, brews smooth.', rating: 4 },
  { text: 'A bit weak for my taste, but decent.', rating: 3 },
  { text: 'Good but a bit pricey.', rating: 4 },
  { text: 'Absolutely love it, my daily cup.', rating: 5 },
];

interface SeededStore {
  store: Store;
  products: Product[];
}

async function truncateAll(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.query(
    `TRUNCATE TABLE "user_favorites", "reviews", "order_items", "orders", "products", "colors", "categories", "stores", "users" RESTART IDENTITY CASCADE`,
  );
  await queryRunner.release();
}

async function seedUsers(dataSource: DataSource) {
  const repo = dataSource.getRepository(User);
  const password = await hash('123456');

  return repo.save([
    repo.create({ name: 'Serii', email: 'seriiburduja@gmail.com', password }),
    repo.create({ name: 'Nixon', email: 'nixon@gmail.com', password }),
    repo.create({ name: 'Buyer', email: 'buyer@example.com', password }),
  ]);
}

async function seedStore(
  dataSource: DataSource,
  owner: User,
  data: StoreSeed,
): Promise<SeededStore> {
  const storeRepo = dataSource.getRepository(Store);
  const categoryRepo = dataSource.getRepository(Category);
  const colorRepo = dataSource.getRepository(Color);
  const productRepo = dataSource.getRepository(Product);

  const store = await storeRepo.save(
    storeRepo.create({
      title: data.title,
      description: data.description,
      userId: owner.id,
    }),
  );

  const categories = await categoryRepo.save(
    data.categories.map((c) =>
      categoryRepo.create({ ...c, storeId: store.id }),
    ),
  );

  const colors = await colorRepo.save(
    data.colors.map((c) => colorRepo.create({ ...c, storeId: store.id })),
  );

  const products = await productRepo.save(
    data.products.map((p) =>
      productRepo.create({
        title: p.title,
        description: p.description,
        price: p.price,
        images: [`https://example.com/${p.image}.jpg`],
        storeId: store.id,
        categoryId: categories[p.category].id,
        colorId: colors[p.color].id,
      }),
    ),
  );

  return { store, products };
}

async function seedStores(dataSource: DataSource, users: User[]) {
  const result: { owner: User; stores: SeededStore[] }[] = [];

  for (const [i, owner] of users.entries()) {
    const stores: SeededStore[] = [];
    for (const data of STORES_BY_USER[i] ?? []) {
      stores.push(await seedStore(dataSource, owner, data));
    }
    result.push({ owner, stores });
  }

  return result;
}

// Every user places one order in each store they don't own.
async function seedOrders(
  dataSource: DataSource,
  seeded: { owner: User; stores: SeededStore[] }[],
) {
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);
  const statuses = Object.values(OrderStatus);
  const orders: Order[] = [];

  for (const { owner: buyer } of seeded) {
    const foreignStores = seeded
      .filter(({ owner }) => owner.id !== buyer.id)
      .flatMap(({ stores }) => stores);

    for (const [i, { store, products }] of foreignStores.entries()) {
      const items = products.slice(0, 2).map((product, j) => ({
        product,
        quantity: j + 1,
      }));

      const order = await orderRepo.save(
        orderRepo.create({
          status: statuses[i % statuses.length],
          total: items.reduce((s, it) => s + it.product.price * it.quantity, 0),
          userId: buyer.id,
        }),
      );

      await orderItemRepo.save(
        items.map((it) =>
          orderItemRepo.create({
            orderId: order.id,
            productId: it.product.id,
            storeId: store.id,
            quantity: it.quantity,
            price: it.product.price,
          }),
        ),
      );

      orders.push(order);
    }
  }

  return orders;
}

// Each product gets a review from every user who doesn't own its store.
async function seedReviews(
  dataSource: DataSource,
  seeded: { owner: User; stores: SeededStore[] }[],
) {
  const repo = dataSource.getRepository(Review);
  const reviews: Review[] = [];
  let n = 0;

  for (const { owner, stores } of seeded) {
    const reviewers = seeded
      .map((s) => s.owner)
      .filter((u) => u.id !== owner.id);

    for (const { store, products } of stores) {
      for (const product of products) {
        for (const reviewer of reviewers) {
          const { text, rating } = REVIEW_TEXTS[n++ % REVIEW_TEXTS.length];
          reviews.push(
            repo.create({
              text,
              rating,
              userId: reviewer.id,
              productId: product.id,
              storeId: store.id,
            }),
          );
        }
      }
    }
  }

  return repo.save(reviews);
}

// Each user favorites the first product of every store they don't own.
async function seedFavorites(
  dataSource: DataSource,
  seeded: { owner: User; stores: SeededStore[] }[],
) {
  const repo = dataSource.getRepository(User);

  for (const { owner } of seeded) {
    const user = await repo.findOneOrFail({
      where: { id: owner.id },
      relations: { favorites: true },
    });
    user.favorites = seeded
      .filter((s) => s.owner.id !== owner.id)
      .flatMap((s) => s.stores.map(({ products }) => products[0]));
    await repo.save(user);
  }
}

async function main() {
  await AppDataSource.initialize();

  try {
    await truncateAll(AppDataSource);

    const users = await seedUsers(AppDataSource);
    const seeded = await seedStores(AppDataSource, users);
    const orders = await seedOrders(AppDataSource, seeded);
    const reviews = await seedReviews(AppDataSource, seeded);
    await seedFavorites(AppDataSource, seeded);

    const stores = seeded.flatMap((s) => s.stores);
    const products = stores.flatMap((s) => s.products);

    console.log('Seed complete:');
    console.log(`  users: ${users.length}`);
    console.log(`  stores: ${stores.length}`);
    console.log(`  products: ${products.length}`);
    console.log(`  orders: ${orders.length}`);
    console.log(`  reviews: ${reviews.length}`);
    console.log('Test accounts (password: 123456):');
    for (const { owner, stores } of seeded) {
      console.log(
        `  ${owner.email} -> ${stores.map((s) => s.store.title).join(', ')}`,
      );
    }
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
