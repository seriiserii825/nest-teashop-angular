import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity.js';

export class UserDto extends OmitType(User, ['password'] as const) {}
