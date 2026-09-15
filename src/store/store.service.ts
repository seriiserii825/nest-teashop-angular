import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new store';
  }

  findAll() {
    return `This action returns all store`;
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

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
