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
  category: string;
  color: string;
}

interface StoreSeed {
  title: string;
  description: string;
  categories: string[];
  colors: string[];
  products: ProductSeed[];
}

// Categories and colors are shared between stores, so the same titles/names
// appear in several stores (each store gets its own rows).
const CATEGORIES: Record<string, string> = {
  Shirts: 'Casual and formal shirts',
  Dresses: 'Dresses, frocks and suits',
  Sneakers: 'Sport and everyday sneakers',
  "Women's Shoes": 'Heels, flats and slippers',
  Bags: 'Handbags and backpacks',
  Sunglasses: 'Sunglasses with UV protection',
};

const COLORS: Record<string, string> = {
  Black: '#212121',
  White: '#fafafa',
  Red: '#e53935',
  Blue: '#1e88e5',
  Gray: '#9e9e9e',
  Brown: '#795548',
  Gold: '#c9a227',
  Green: '#43a047',
};

const CDN = 'https://cdn.dummyjson.com/product-images';

// Indexed by user: STORE_BY_USER[i] is the store owned by users[i].
const STORE_BY_USER: StoreSeed[] = [
  {
    title: 'Serii Urban Wear',
    description: 'Everyday clothing, sneakers and accessories',
    categories: ['Shirts', 'Dresses', 'Sneakers', 'Bags', 'Sunglasses'],
    colors: ['Black', 'White', 'Red', 'Blue', 'Gray'],
    products: [
      {
        title: 'Blue & Black Check Shirt',
        description: 'Classic check shirt for casual and semi-formal looks',
        price: 2990,
        image: `${CDN}/mens-shirts/blue-&-black-check-shirt/1.webp`,
        category: 'Shirts',
        color: 'Blue',
      },
      {
        title: 'Man Plaid Shirt',
        description: 'Timeless plaid shirt with a comfortable fit',
        price: 3490,
        image: `${CDN}/mens-shirts/man-plaid-shirt/1.webp`,
        category: 'Shirts',
        color: 'Red',
      },
      {
        title: 'Blue Frock',
        description: 'Charming blue frock for any occasion',
        price: 3990,
        image: `${CDN}/tops/blue-frock/1.webp`,
        category: 'Dresses',
        color: 'Blue',
      },
      {
        title: 'Nike Air Jordan 1 Red And Black',
        description: 'Iconic basketball sneaker in red and black',
        price: 14990,
        image: `${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/1.webp`,
        category: 'Sneakers',
        color: 'Red',
      },
      {
        title: 'Puma Future Rider Trainers',
        description: 'Retro-styled trainers with modern comfort',
        price: 8990,
        image: `${CDN}/mens-shoes/puma-future-rider-trainers/1.webp`,
        category: 'Sneakers',
        color: 'Gray',
      },
      {
        title: 'Women Handbag Black',
        description: 'Classic black handbag that fits any outfit',
        price: 5990,
        image: `${CDN}/womens-bags/women-handbag-black/1.webp`,
        category: 'Bags',
        color: 'Black',
      },
      {
        title: 'Black Sun Glasses',
        description: 'Sleek black frame with tinted UV lenses',
        price: 2490,
        image: `${CDN}/sunglasses/black-sun-glasses/1.webp`,
        category: 'Sunglasses',
        color: 'Black',
      },
    ],
  },
  {
    title: 'Nixon Boutique',
    description: 'Elegant dresses, shoes and designer bags',
    categories: [
      'Shirts',
      'Dresses',
      'Sneakers',
      "Women's Shoes",
      'Bags',
      'Sunglasses',
    ],
    colors: ['Black', 'White', 'Red', 'Gray', 'Brown', 'Gold'],
    products: [
      {
        title: 'Men Check Shirt',
        description: 'Smart check shirt for a polished look',
        price: 3290,
        image: `${CDN}/mens-shirts/men-check-shirt/1.webp`,
        category: 'Shirts',
        color: 'Gray',
      },
      {
        title: 'Corset Leather With Skirt',
        description: 'Bold leather corset paired with a matching skirt',
        price: 8990,
        image: `${CDN}/womens-dresses/corset-leather-with-skirt/1.webp`,
        category: 'Dresses',
        color: 'Black',
      },
      {
        title: 'Marni Red & Black Suit',
        description: 'Sophisticated red and black suit ensemble',
        price: 17990,
        image: `${CDN}/womens-dresses/marni-red-&-black-suit/1.webp`,
        category: 'Dresses',
        color: 'Red',
      },
      {
        title: 'Gray Dress',
        description: 'Versatile neutral dress, easy to dress up or down',
        price: 4590,
        image: `${CDN}/tops/gray-dress/1.webp`,
        category: 'Dresses',
        color: 'Gray',
      },
      {
        title: 'Sports Sneakers Off White & Red',
        description: 'Off-white sneakers with bold red accents',
        price: 7990,
        image: `${CDN}/mens-shoes/sports-sneakers-off-white-&-red/1.webp`,
        category: 'Sneakers',
        color: 'White',
      },
      {
        title: 'Calvin Klein Heel Shoes',
        description: 'Elegant heels for formal occasions',
        price: 11990,
        image: `${CDN}/womens-shoes/calvin-klein-heel-shoes/1.webp`,
        category: "Women's Shoes",
        color: 'Black',
      },
      {
        title: 'Golden Shoes Woman',
        description: 'Glamorous golden shoes for special evenings',
        price: 9490,
        image: `${CDN}/womens-shoes/golden-shoes-woman/1.webp`,
        category: "Women's Shoes",
        color: 'Gold',
      },
      {
        title: 'Prada Women Bag',
        description: 'Iconic designer bag with the Prada logo',
        price: 59990,
        image: `${CDN}/womens-bags/prada-women-bag/1.webp`,
        category: 'Bags',
        color: 'Brown',
      },
      {
        title: 'White Faux Leather Backpack',
        description: 'Trendy white backpack with plenty of space',
        price: 6490,
        image: `${CDN}/womens-bags/white-faux-leather-backpack/1.webp`,
        category: 'Bags',
        color: 'White',
      },
      {
        title: 'Classic Sun Glasses',
        description: 'Timeless neutral frame with UV-protected lenses',
        price: 2990,
        image: `${CDN}/sunglasses/classic-sun-glasses/1.webp`,
        category: 'Sunglasses',
        color: 'Brown',
      },
    ],
  },
  {
    title: 'Buyer Street Style',
    description: 'Streetwear, sneakers and summer looks',
    categories: [
      'Shirts',
      'Dresses',
      'Sneakers',
      "Women's Shoes",
      'Sunglasses',
    ],
    colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray'],
    products: [
      {
        title: 'Gigabyte Aorus Men Tshirt',
        description: 'Casual gaming tee with the Aorus logo',
        price: 1990,
        image: `${CDN}/mens-shirts/gigabyte-aorus-men-tshirt/1.webp`,
        category: 'Shirts',
        color: 'Black',
      },
      {
        title: 'Man Short Sleeve Shirt',
        description: 'Breezy short sleeve shirt for warm days',
        price: 2490,
        image: `${CDN}/mens-shirts/man-short-sleeve-shirt/1.webp`,
        category: 'Shirts',
        color: 'Blue',
      },
      {
        title: 'Tartan Dress',
        description: 'Classic tartan pattern for fall and winter',
        price: 5490,
        image: `${CDN}/tops/tartan-dress/1.webp`,
        category: 'Dresses',
        color: 'Red',
      },
      {
        title: 'Girl Summer Dress',
        description: 'Light and breezy dress for hot summer days',
        price: 3790,
        image: `${CDN}/tops/girl-summer-dress/1.webp`,
        category: 'Dresses',
        color: 'Green',
      },
      {
        title: 'Sports Sneakers Off White Red',
        description: 'Comfortable off-white sneakers for casual wear',
        price: 7490,
        image: `${CDN}/mens-shoes/sports-sneakers-off-white-red/1.webp`,
        category: 'Sneakers',
        color: 'White',
      },
      {
        title: 'Nike Baseball Cleats',
        description: 'Cleats with maximum traction on the field',
        price: 9990,
        image: `${CDN}/mens-shoes/nike-baseball-cleats/1.webp`,
        category: 'Sneakers',
        color: 'Black',
      },
      {
        title: 'Red Shoes',
        description: 'Vibrant red shoes that make a statement',
        price: 6990,
        image: `${CDN}/womens-shoes/red-shoes/1.webp`,
        category: "Women's Shoes",
        color: 'Red',
      },
      {
        title: 'Pampi Shoes',
        description: 'Comfortable everyday shoes with a trendy look',
        price: 4990,
        image: `${CDN}/womens-shoes/pampi-shoes/1.webp`,
        category: "Women's Shoes",
        color: 'White',
      },
      {
        title: 'Green and Black Glasses',
        description: 'Eye-catching green and black frame',
        price: 2290,
        image: `${CDN}/sunglasses/green-and-black-glasses/1.webp`,
        category: 'Sunglasses',
        color: 'Green',
      },
      {
        title: 'Party Glasses',
        description: 'Playful frames to add flair to any party',
        price: 1490,
        image: `${CDN}/sunglasses/party-glasses/1.webp`,
        category: 'Sunglasses',
        color: 'Blue',
      },
    ],
  },
];

const REVIEW_TEXTS: { text: string; rating: number }[] = [
  { text: 'Great quality, will buy again!', rating: 5 },
  { text: 'Fits well, looks just like the photo.', rating: 4 },
  { text: 'Runs a bit small, but decent.', rating: 3 },
  { text: 'Good but a bit pricey.', rating: 4 },
  { text: 'Absolutely love it, wear it all the time.', rating: 5 },
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
    data.categories.map((title) =>
      categoryRepo.create({
        title,
        description: CATEGORIES[title],
        storeId: store.id,
      }),
    ),
  );

  const colors = await colorRepo.save(
    data.colors.map((name) =>
      colorRepo.create({ name, value: COLORS[name], storeId: store.id }),
    ),
  );

  const categoryId = new Map(categories.map((c) => [c.title, c.id]));
  const colorId = new Map(colors.map((c) => [c.name, c.id]));

  const products = await productRepo.save(
    data.products.map((p) =>
      productRepo.create({
        title: p.title,
        description: p.description,
        price: p.price,
        images: [p.image],
        storeId: store.id,
        categoryId: categoryId.get(p.category),
        colorId: colorId.get(p.color),
      }),
    ),
  );

  return { store, products };
}

async function seedStores(dataSource: DataSource, users: User[]) {
  const result: { owner: User; stores: SeededStore[] }[] = [];

  for (const [i, owner] of users.entries()) {
    const data = STORE_BY_USER[i];
    const stores = data ? [await seedStore(dataSource, owner, data)] : [];
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
