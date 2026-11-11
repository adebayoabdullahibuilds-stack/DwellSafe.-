import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthSession } from './auth.service';
import { AuthSessionGuard } from './auth-session.guard';
import { LoginDto, RegisterDto } from './auth.dto';
import type { AuthenticatedRequest } from './auth.types';

const sessionCookieName = 'dwellsafe_session';

function setSessionCookie(response: Response, session: AuthSession, secure: boolean) {
  response.cookie(sessionCookieName, session.token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    expires: session.expiresAt,
  });
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() input: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.register(input);
    setSessionCookie(response, session, this.config.get<string>('NODE_ENV') === 'production');
    return { user: session.user };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.authService.login(input);
    setSessionCookie(response, session, this.config.get<string>('NODE_ENV') === 'production');
    return { user: session.user };
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(AuthSessionGuard)
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.sessionId) throw new UnauthorizedException('Authentication is required.');
    await this.authService.logout(request.sessionId);
    response.clearCookie(sessionCookieName, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  @Get('me')
  @UseGuards(AuthSessionGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest) {
    return { user: request.auth };
  }
}
