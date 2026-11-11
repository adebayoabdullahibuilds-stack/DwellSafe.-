import { Test } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { hashPassword } from './password-hasher';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('creates a normalized account and stores only a session-token hash', async () => {
    const user = {
      id: 'user-1',
      email: 'tenant@example.com',
      displayName: 'Tenant',
      roles: [{ role: UserRole.TENANT }],
    };
    const createUser = jest.fn().mockResolvedValue(user);
    const createSession = jest.fn().mockResolvedValue({});
    const prisma = {
      $transaction: jest.fn((callback: (transaction: unknown) => Promise<unknown>) => callback({
        user: { create: createUser },
        session: { create: createSession },
      })),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    const service = moduleRef.get(AuthService);
    const session = await service.register({
      email: ' Tenant@Example.com ',
      displayName: ' Tenant ',
      password: 'a long test password',
      role: 'TENANT',
    });

    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        email: 'tenant@example.com',
        displayName: 'Tenant',
        roles: { create: { role: 'TENANT' } },
      }),
    }));
    expect(createSession).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        tokenHash: expect.not.stringContaining(session.token),
        expiresAt: session.expiresAt,
      }),
    });
    expect(session.user.roles).toEqual([UserRole.TENANT]);
    await moduleRef.close();
  });

  it('creates a session only after valid credentials are checked', async () => {
    const passwordHash = await hashPassword('a long test password');
    const sessionCreate = jest.fn().mockResolvedValue({});
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          email: 'tenant@example.com',
          displayName: 'Tenant',
          passwordHash,
          isDisabled: false,
          roles: [{ role: UserRole.TENANT }],
        }),
      },
      session: { create: sessionCreate },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    const service = moduleRef.get(AuthService);
    const session = await service.login({
      email: ' Tenant@Example.com ',
      password: 'a long test password',
    });

    expect(session.user.email).toBe('tenant@example.com');
    expect(sessionCreate).toHaveBeenCalledTimes(1);
    await moduleRef.close();
  });

  it('rejects unknown accounts without creating a session', async () => {
    const sessionCreate = jest.fn();
    const prisma = {
      user: { findUnique: jest.fn().mockResolvedValue(null) },
      session: { create: sessionCreate },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    const service = moduleRef.get(AuthService);
    await expect(service.login({
      email: 'unknown@example.com',
      password: 'a long test password',
    })).rejects.toThrow('Invalid email or password.');
    expect(sessionCreate).not.toHaveBeenCalled();
    await moduleRef.close();
  });
});
