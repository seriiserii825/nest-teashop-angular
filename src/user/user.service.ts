import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/dto/auth.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(dto: AuthDto): Promise<User> {
    const user = await this.userRepository.save({
      ...dto,
      password: dto.password ? await hash(dto.password) : null,
    });
    return this.findOne(user.id);
  }

  findAll(): string {
    return `This action returns all user`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { stores: true, favorites: true, orders: true, reviews: true },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { stores: true, favorites: true, orders: true, reviews: true },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): string {
    return `This action updates a #${id} user`;
  }

  remove(id: string): string {
    return `This action removes a #${id} user`;
  }
}
