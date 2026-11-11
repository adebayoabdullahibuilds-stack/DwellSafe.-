import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { UserRole } from '@prisma/client';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../database/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { hashPassword, verifyPassword } from './password-hasher';

const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const dummyPasswordHash = `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`;

export type AuthSession = {
  token: string;
  expiresAt: Date;
  user: {
    id: string;
    email: string;
    displayName: string;
    roles: UserRole[];
  };
};

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterDto): Promise<AuthSession> {
    const email = input.email.trim().toLowerCase();
    const passwordHash = await hashPassword(input.password);
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + sessionLifetimeMs);

    try {
      const user = await this.prisma.$transaction(async (transaction) => {
        const created = await transaction.user.create({
          data: {
            email,
            displayName: input.displayName.trim(),
            passwordHash,
            roles: { create: { role: input.role } },
          },
          include: { roles: { select: { role: true } } },
        });
        await transaction.session.create({
          data: {
            userId: created.id,
            tokenHash: createHash('sha256').update(token).digest('hex'),
            expiresAt,
          },
        });
        return created;
      });

      return {
        token,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          roles: user.roles.map(({ role }) => role),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }

  async login(input: LoginDto): Promise<AuthSession> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
      include: { roles: { select: { role: true } } },
    });
    const passwordMatches = await verifyPassword(
      input.password,
      user?.passwordHash ?? dummyPasswordHash,
    );
    if (!user || user.isDisabled || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + sessionLifetimeMs);
    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: createHash('sha256').update(token).digest('hex'),
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        roles: user.roles.map(({ role }) => role),
      },
    };
  }

  async logout(sessionId: string) {
    await this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
