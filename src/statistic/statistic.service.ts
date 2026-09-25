import { Injectable } from '@nestjs/common';
import { OrderService } from '../order/order.service.js';
import { ProductService } from '../product/product.service.js';
import { CategoryService } from '../category/category.service.js';
import { ReviewService } from '../review/review.service.js';
import { UserService } from '../user/user.service.js';
import { User } from '../user/entities/user.entity.js';
import {
  MainStatisticDto,
  MonthlySalesDto,
} from './dto/statistic-response.dto.js';

@Injectable()
export class StatisticService {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  async getMainStatistic(storeId: string): Promise<MainStatisticDto> {
    const totalRevenue = await this.calculateTotalRevenue(storeId);
    const productsCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);

    const averageRating = await this.calculateAverageRating(storeId);

    return { totalRevenue, productsCount, categoriesCount, averageRating };
  }

  async getMiddleStatistics(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);
    const latestUsers = await this.getLatestUsers(storeId);
    return { monthlySales, latestUsers };
  }

  private async calculateMonthlySales(
    storeId: string,
  ): Promise<MonthlySalesDto[]> {
    const orders = await this.orderService.findByStoreId(storeId);
    const monthlySales = new Map<string, number>();

    orders.forEach((order) => {
      const month = String(order.createdAt.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = order.createdAt.getFullYear();
      const date = `${year}-${month}`;

      monthlySales.set(date, (monthlySales.get(date) ?? 0) + order.total);
    });

    return Array.from(monthlySales, ([date, value]) => ({
      date,
      value: String(value),
    })).sort((a, b) => a.date.localeCompare(b.date));
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
