import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto.js';
import { Response } from 'express';

@Injectable()
export class AuthService {
  REFRESH_TOKEN_NAME = 'refreshToken';
  EXPIRE_DAY_REFRESH_TOKEN: string;

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.EXPIRE_DAY_REFRESH_TOKEN = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.findByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userService.create(dto);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userService.findOne(result.id);
    const tokens = this.generateTokens(user.id);
    return { user, ...tokens };
  }

  generateTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async validateOAuthLogin(req: any) {
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

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    const newDate =
      expiresIn.getDate() + parseInt(this.EXPIRE_DAY_REFRESH_TOKEN);
    expiresIn.setDate(newDate);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.getOrThrow('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none', // for production use 'lax'
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.getOrThrow('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none', // for production use 'lax'
    });
  }
}
