import { Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service.js';
import { ProductService } from '../product/product.service.js';
import { CategoryService } from '../category/category.service.js';
import { ReviewService } from '../review/review.service.js';
import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class StatisticService {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  async getMainStatistic(storeId: string) {
    const totalRevenue = await this.calculateTotalRevenue(storeId);
    const productsCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);

    const averageRating = await this.calculateAverageRating(storeId);

    return [
      { id: 1, name: 'Total Revenue', value: totalRevenue },
      { id: 2, name: 'Products Count', value: productsCount },
      { id: 3, name: 'Categories Count', value: categoriesCount },
      { id: 4, name: 'Average Rating', value: averageRating },
    ];
  }

  async getMiddleStatistics(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);
    const latestUsers = await this.getLatestUsers(storeId);
    return { monthlySales, latestUsers };
  }

  private async calculateMonthlySales(storeId: string) {
    const orders = await this.orderService.findByStoreId(storeId);
    const monthlySales = {} as Record<string, number>;

    orders.forEach((order) => {
      const month = order.createdAt.getMonth() + 1; // Months are zero-based
      const year = order.createdAt.getFullYear();
      const key = `${year}-${month}`;

      if (!monthlySales[key]) {
        monthlySales[key] = 0;
      }
      monthlySales[key] += order.total;
    });

    return monthlySales;
  }

  private async getLatestUsers(storeId: string): Promise<User[]> {
    const orders = await this.orderService.findByStoreId(storeId);
    const userIds = new Set(orders.map((order) => order.userId));
    const user_ids = Array.from(userIds).slice(-5);
    return this.userService.findByIds(user_ids);
  }

  private async calculateTotalRevenue(storeId: string): Promise<number> {
    const orders = await this.orderService.findByStoreId(storeId);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    return totalRevenue;
  }

  private async countProducts(storeId: string): Promise<number> {
    const products_count = await this.productService.countByStoreId(storeId);
    return products_count;
  }

  private async countCategories(storeId: string): Promise<number> {
    const categories_count = await this.categoryService.countByStoreId(storeId);
    return categories_count;
  }

  private async calculateAverageRating(storeId: string): Promise<number> {
    return this.reviewService.calculateAverageRating(storeId);
  }
}
