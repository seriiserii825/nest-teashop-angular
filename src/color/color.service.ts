import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';
import { Color } from './entities/color.entity.js';
import { StoreService } from '../store/store.service.js';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    private readonly storeService: StoreService,
  ) {}

  async getByStoreId(
    userId: string,
    storeId: string,
    colorId: string,
  ): Promise<Color> {
    await this.storeService.findOne(storeId, userId);
    const color = await this.colorRepository.findOne({
      where: { id: colorId, storeId },
      relations: { store: true },
    });
    if (!color) {
      throw new BadRequestException(
        `Color with id ${colorId} not found for store ${storeId}`,
      );
    }
    return color;
  }

  async create(userId: string, storeId: string, dto: CreateColorDto) {
    await this.storeService.findOne(storeId, userId);
    const existingColor = await this.colorRepository.findOne({
      where: { storeId, name: dto.name },
    });
    if (existingColor) {
      throw new BadRequestException(
        `Color with name ${dto.name} already exists for this store`,
      );
    }
    const color = this.colorRepository.create({ ...dto, storeId });
    return this.colorRepository.save(color);
  }

  async findAll(userId: string, storeId: string) {
    await this.storeService.findOne(storeId, userId);
    return this.colorRepository.find({
      where: { storeId },
      relations: { store: true },
    });
  }

  async update(
    userId: string,
    storeId: string,
    colorId: string,
    dto: UpdateColorDto,
  ) {
    await this.storeService.findOne(storeId, userId);
    const color = await this.colorRepository.findOne({
      where: { id: colorId, storeId },
    });
    if (!color) {
      throw new BadRequestException(
        `Color with id ${colorId} not found for store ${storeId}`,
      );
    }
    await this.colorRepository.update({ id: colorId, storeId }, dto);
    return this.colorRepository.findOne({
      where: { id: colorId, storeId },
      relations: { store: true },
    });
  }

  async remove(userId: string, storeId: string, colorId: string) {
    await this.storeService.findOne(storeId, userId);
    const color = await this.colorRepository.findOne({
      where: { id: colorId, storeId },
    });
    if (!color) {
      throw new BadRequestException(
        `Color with id ${colorId} not found for store ${storeId}`,
      );
    }
    await this.colorRepository.delete({ id: colorId, storeId });
    return { message: `Color with id ${colorId} deleted successfully` };
  }
}
