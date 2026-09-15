import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/dto/auth.dto.js';
import { Product } from '../product/entities/product.entity.js';
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

  async toggleFavoriteProduct(
    userId: string,
    productId: string,
  ): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favorites', 'product')
      .where('user.id = :userId', { userId })
      .getOne()
      .then(async (user) => {
        if (!user) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
        const isFavorite = user.favorites.some(
          (product) => product.id === productId,
        );
        if (isFavorite) {
          user.favorites = user.favorites.filter(
            (product) => product.id !== productId,
          );
        } else {
          const product = await this.userRepository.manager.findOne(Product, {
            where: { id: productId },
          });
          if (!product) {
            throw new NotFoundException(
              `Product with id ${productId} not found`,
            );
          }
          user.favorites.push(product);
        }
        await this.userRepository.save(user);
        return this.findOne(userId);
      });
  }
}
