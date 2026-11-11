import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  PaymentAttemptStatus,
  PaymentObligationStatus,
  PaymentSubmissionStatus,
} from '@prisma/client';

const obligationTransitions: Record<PaymentObligationStatus, PaymentObligationStatus[]> = {
  DRAFT: ['AWAITING_PAYMENT', 'CANCELLED'],
  AWAITING_PAYMENT: ['PAYMENT_SUBMITTED', 'UNDER_REVIEW', 'DISPUTED', 'CANCELLED'],
  PAYMENT_SUBMITTED: ['UNDER_REVIEW', 'PARTIALLY_PAID', 'PAID', 'REJECTED', 'DISPUTED'],
  UNDER_REVIEW: ['PAYMENT_SUBMITTED', 'PARTIALLY_PAID', 'PAID', 'REJECTED', 'DISPUTED'],
  PARTIALLY_PAID: ['PAYMENT_SUBMITTED', 'UNDER_REVIEW', 'PAID', 'DISPUTED'],
  PAID: ['DISPUTED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
  REJECTED: ['AWAITING_PAYMENT', 'PAYMENT_SUBMITTED', 'CANCELLED'],
  DISPUTED: ['UNDER_REVIEW', 'PARTIALLY_PAID', 'PAID', 'REJECTED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
  PARTIALLY_REFUNDED: ['REFUNDED', 'DISPUTED'],
};

const submissionTransitions: Record<PaymentSubmissionStatus, PaymentSubmissionStatus[]> = {
  SUBMITTED: ['CONFIRMED', 'REJECTED', 'NEEDS_INFORMATION'],
  CONFIRMED: [],
  REJECTED: [],
  NEEDS_INFORMATION: ['SUBMITTED', 'REJECTED'],
};

const paymentAttemptTransitions: Record<PaymentAttemptStatus, PaymentAttemptStatus[]> = {
  CREATED: ['PENDING', 'FAILED', 'EXPIRED', 'CANCELLED'],
  PENDING: ['PROCESSING', 'SUCCESSFUL', 'FAILED', 'EXPIRED', 'CANCELLED'],
  PROCESSING: ['SUCCESSFUL', 'FAILED'],
  SUCCESSFUL: ['REFUNDED', 'PARTIALLY_REFUNDED'],
  FAILED: [],
  EXPIRED: [],
  CANCELLED: [],
  REFUNDED: [],
  PARTIALLY_REFUNDED: ['REFUNDED'],
};

export function assertObligationTransition(
  current: PaymentObligationStatus,
  next: PaymentObligationStatus,
  reason?: string,
) {
  if (!obligationTransitions[current].includes(next)) {
    throw new ConflictException(`Payment obligation cannot move from ${current} to ${next}.`);
  }
  if (next === PaymentObligationStatus.REJECTED && !reason?.trim()) {
    throw new BadRequestException('A reason is required to reject a payment obligation.');
  }
}

export function assertSubmissionTransition(
  current: PaymentSubmissionStatus,
  next: PaymentSubmissionStatus,
  reason?: string,
) {
  if (!submissionTransitions[current].includes(next)) {
    throw new ConflictException(`Payment submission cannot move from ${current} to ${next}.`);
  }
  if (next === PaymentSubmissionStatus.REJECTED && !reason?.trim()) {
    throw new BadRequestException('A reason is required to reject a payment submission.');
  }
}

export function assertPaymentAttemptTransition(
  current: PaymentAttemptStatus,
  next: PaymentAttemptStatus,
) {
  if (!paymentAttemptTransitions[current].includes(next)) {
    throw new ConflictException(`Payment attempt cannot move from ${current} to ${next}.`);
  }
}
