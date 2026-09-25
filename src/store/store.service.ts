import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto.js';
import { UpdateStoreDto } from './dto/update-store.dto.js';
import { Store } from './entities/store.entity.js';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(userId: string, dto: CreateStoreDto) {
    const existingStore = await this.storeRepository.findOne({
      where: { userId, title: dto.title },
    });
    if (existingStore) {
      throw new BadRequestException(
        `Store with title ${dto.title} already exists for this user`,
      );
    }
    const store = this.storeRepository.create({ ...dto, userId });
    return this.storeRepository.save(store);
  }

  async update(userId: string, storeId: string, dto: UpdateStoreDto) {
    const store = await this.findOne(storeId, userId);
    if (dto.title && dto.title !== store.title) {
      const existingStore = await this.storeRepository.findOne({
        where: { userId, title: dto.title },
      });
      if (existingStore) {
        throw new BadRequestException(
          `Store with title ${dto.title} already exists for this user`,
        );
      }
    }
    Object.assign(store, dto);
    return this.storeRepository.save(store);
  }

  async remove(userId: string, storeId: string) {
    const store = await this.findOne(storeId, userId);
    return this.storeRepository.remove(store);
  }

  async findOne(storeId: string, userId: string) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, userId },
      relations: { products: true, reviews: true },
    });
    if (!store) {
      throw new NotFoundException(
        `Store with id ${storeId} not found, or you not an owner of this store`,
      );
    }
    return store;
  }

  async findAll(userId: string) {
    return this.storeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { products: true, reviews: true },
    });
  }
}
