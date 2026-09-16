import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';
import { Color } from './entities/color.entity.js';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async getByStoreId(storeId: string, colorId: string): Promise<Color[]> {
    return this.colorRepository.find({ where: { storeId, id: colorId } });
  }

  async create(storeId: string, dto: CreateColorDto) {
    const existingStore = await this.colorRepository.findOne({
      where: { storeId, name: dto.name },
    });
    if (existingStore) {
      throw new BadRequestException(
        `Store with title ${dto.name} already exists for this user`,
      );
    }
    const color = this.colorRepository.create({ ...dto, storeId });
    return this.colorRepository.save(color);
  }

  findAll() {
    return this.colorRepository.find();
  }

  findOne(colorId: string) {
    return this.colorRepository.findOne({ where: { id: colorId } });
  }

  update(storeId: string, colorId: string, dto: UpdateColorDto) {
    return this.colorRepository.update({ id: colorId, storeId }, dto);
  }

  remove(storeId: string, colorId: string) {
    return this.colorRepository.delete({ id: colorId, storeId });
  }
}
