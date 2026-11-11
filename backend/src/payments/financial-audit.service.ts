import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type FinancialAuditEntry = {
  actorUserId?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  previousState?: Prisma.InputJsonValue;
  newState?: Prisma.InputJsonValue;
  reason?: string;
  requestId?: string;
};

@Injectable()
export class FinancialAuditService {
  constructor(private readonly prisma: PrismaService) {}

  append(entry: FinancialAuditEntry) {
    return this.prisma.financialAuditLog.create({
      data: {
        actorUserId: entry.actorUserId,
        entityType: entry.entityType,
        entityId: entry.entityId,
        action: entry.action,
        previousState: entry.previousState,
        newState: entry.newState,
        reason: entry.reason,
        requestId: entry.requestId,
      },
    });
  }
}
