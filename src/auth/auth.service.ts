import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UserService } from '../user/user.service.js';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto.js';
import { Response } from 'express';
import { User } from '../user/entities/user.entity.js';
import ms from 'ms';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult extends Tokens {
  user: User;
}

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDto): Promise<AuthResult> {
    const validatedUser = await this.validateUser(dto);
    const user = await this.userService.findOne(validatedUser.id);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async register(dto: AuthDto): Promise<AuthResult> {
    const oldUser = await this.userService.findByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userService.create(dto);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string): Promise<AuthResult> {
    let result: { id: string };
    try {
      result = await this.jwt.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userService.findOne(result.id);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  generateTokens(userId: string): Tokens {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.userService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password || !dto.password || !(await verify(user.password, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async validateOAuthLogin(req: any): Promise<AuthResult> {
    let user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      user = await this.userService.create({
        email: req.user.email,
        name: req.user.name,
      });
    }
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string): void {
    const expiresIn = new Date(
      Date.now() + ms(this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN')),
    );

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.getOrThrow('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none', // for production use 'lax'
    });
  }

  removeRefreshTokenFromResponse(res: Response): void {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.getOrThrow('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none', // for production use 'lax'
    });
  }
}
