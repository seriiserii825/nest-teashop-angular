import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/auth.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiOkResponse({
    description: 'Returns an access token and the authenticated user.',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @ApiOperation({ summary: 'Exchange the refresh token cookie for a new access token' })
  @ApiOkResponse({
    description: 'Returns a new access token and the authenticated user.',
  })
  @ApiUnauthorizedResponse({ description: 'Refresh token missing or invalid.' })
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookie =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookie) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException('Refresh token not found');
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookie,
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({
    description: 'Returns an access token and the created user.',
  })
  @HttpCode(201)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  @ApiOperation({ summary: 'Log out and clear the refresh token cookie' })
  @ApiOkResponse({ description: 'Logged out successfully.' })
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return { message: 'Logged out successfully' };
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Initiates the Google OAuth2 login flow
  }

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return res.redirect(
      `${this.configService.get('CLIENT_URL')}/dashboard?accessToken=${response.accessToken}`,
    );
  }
}
