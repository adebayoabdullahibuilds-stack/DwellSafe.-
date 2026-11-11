import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentAuthorizationStatus, UserRole } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/auth.types';
import { PrismaService } from '../database/prisma.service';

export type TransactionAccessRecord = {
  propertyId: string;
  tenantId: string;
  landlordId: string;
  primaryAgentId: string | null;
};

export function canAccessTransaction(
  actor: AuthenticatedUser,
  transaction: TransactionAccessRecord,
  hasActivePropertyAuthorization: boolean,
) {
  if (actor.roles.includes(UserRole.ADMIN)) return true;
  if (actor.roles.includes(UserRole.TENANT) && transaction.tenantId === actor.userId) return true;
  if (actor.roles.includes(UserRole.LANDLORD) && transaction.landlordId === actor.userId) return true;
  if (
    actor.roles.includes(UserRole.AGENT)
    && (transaction.primaryAgentId === actor.userId || hasActivePropertyAuthorization)
  ) return true;
  return false;
}

export function canAccessObligation(
  actor: AuthenticatedUser,
  transaction: Pick<TransactionAccessRecord, 'tenantId'> | null,
  beneficiaryUserId: string | null,
) {
  if (actor.roles.includes(UserRole.ADMIN)) return true;
  if (actor.roles.includes(UserRole.TENANT) && transaction?.tenantId === actor.userId) return true;
  return beneficiaryUserId === actor.userId;
}

@Injectable()
export class PaymentAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCanAccessTransaction(actor: AuthenticatedUser, transactionId: string) {
    const transaction = await this.prisma.rentalTransaction.findUnique({
      where: { id: transactionId },
      select: {
        propertyId: true,
        tenantId: true,
        landlordId: true,
        primaryAgentId: true,
      },
    });
    if (!transaction) throw new NotFoundException('Transaction not found.');

    const hasActiveAuthorization = actor.roles.includes(UserRole.AGENT)
      ? Boolean(await this.prisma.propertyAgentAuthorization.findFirst({
        where: {
          propertyId: transaction.propertyId,
          agentUserId: actor.userId,
          status: AgentAuthorizationStatus.ACTIVE,
        },
        select: { id: true },
      }))
      : false;

    if (!canAccessTransaction(actor, transaction, hasActiveAuthorization)) {
      throw new NotFoundException('Transaction not found.');
    }
    return transaction;
  }

  async assertCanAccessObligation(actor: AuthenticatedUser, obligationId: string) {
    const obligation = await this.prisma.paymentObligation.findUnique({
      where: { id: obligationId },
      select: {
        beneficiaryUserId: true,
        rentalTransaction: { select: { tenantId: true } },
      },
    });
    if (!obligation) throw new NotFoundException('Payment obligation not found.');
    if (!canAccessObligation(actor, obligation.rentalTransaction, obligation.beneficiaryUserId)) {
      throw new NotFoundException('Payment obligation not found.');
    }
    return obligation;
  }

  async assertCanReviewSubmission(actor: AuthenticatedUser, submissionId: string) {
    const submission = await this.prisma.paymentSubmission.findUnique({
      where: { id: submissionId },
      select: {
        paymentObligation: { select: { beneficiaryUserId: true } },
      },
    });
    if (!submission || submission.paymentObligation.beneficiaryUserId !== actor.userId) {
      throw new NotFoundException('Payment submission not found.');
    }
    return submission;
  }
}
