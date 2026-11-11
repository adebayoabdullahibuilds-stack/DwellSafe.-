import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import type { AuthenticatedRequest } from './auth.types';

const sessionCookieName = 'dwellsafe_session';

function readSessionCookie(cookieHeader?: string) {
  const cookie = cookieHeader?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`));
  return cookie?.slice(sessionCookieName.length + 1);
}

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = readSessionCookie(request.headers.cookie);
    if (!token) throw new UnauthorizedException('Authentication is required.');

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      include: { user: { include: { roles: { select: { role: true } } } } },
    });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.isDisabled) {
      throw new UnauthorizedException('Your session is invalid or expired.');
    }

    request.auth = {
      userId: session.userId,
      roles: session.user.roles.map(({ role }) => role),
    };
    request.sessionId = session.id;
    return true;
  }
}
