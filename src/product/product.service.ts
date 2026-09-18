import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, Repository} from 'typeorm';
import {Product} from './entities/product.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(searchTerm?: string): Promise<Product[]> {
    if (searchTerm) {
      const filter = this.getBySearchTerm(searchTerm);
      return this.productRepository.find({
        where: filter,
        order: { createdAt: 'DESC' },
        relations: {
          store: true,
          category: true,
          color: true,
          reviews: true,
        },
      });
    }
    return this.productRepository.find();
  }

  private getBySearchTerm(searchTerm: string) {
    return [
      { title: ILike(`%${searchTerm}%`) },
      { description: ILike(`%${searchTerm}%`) },
    ];
  }
}
