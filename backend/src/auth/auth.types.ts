import type { UserRole } from '@prisma/client';
import type { Request } from 'express';

export type AuthenticatedUser = {
  userId: string;
  roles: UserRole[];
};

export type AuthenticatedRequest = Request & {
  auth?: AuthenticatedUser;
  sessionId?: string;
};
