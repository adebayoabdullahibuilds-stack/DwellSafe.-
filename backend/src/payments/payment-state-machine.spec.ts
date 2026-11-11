import { ConflictException } from '@nestjs/common';
import {
  PaymentAttemptStatus,
  PaymentObligationStatus,
  PaymentSubmissionStatus,
} from '@prisma/client';
import {
  assertPaymentAttemptTransition,
  assertObligationTransition,
  assertSubmissionTransition,
} from './payment-state-machine';

describe('payment state transitions', () => {
  it('allows a draft obligation to become payable', () => {
    expect(() => assertObligationTransition(
      PaymentObligationStatus.DRAFT,
      PaymentObligationStatus.AWAITING_PAYMENT,
    )).not.toThrow();
  });

  it('prevents a paid obligation from being cancelled', () => {
    expect(() => assertObligationTransition(
      PaymentObligationStatus.PAID,
      PaymentObligationStatus.CANCELLED,
    )).toThrow(ConflictException);
  });

  it('allows more information to be requested before resubmission', () => {
    expect(() => assertSubmissionTransition(
      PaymentSubmissionStatus.NEEDS_INFORMATION,
      PaymentSubmissionStatus.SUBMITTED,
    )).not.toThrow();
  });

  it('keeps a confirmed submission terminal', () => {
    expect(() => assertSubmissionTransition(
      PaymentSubmissionStatus.CONFIRMED,
      PaymentSubmissionStatus.REJECTED,
    )).toThrow(ConflictException);
  });

  it('requires a reason to reject a payment submission', () => {
    expect(() => assertSubmissionTransition(
      PaymentSubmissionStatus.SUBMITTED,
      PaymentSubmissionStatus.REJECTED,
    )).toThrow('A reason is required to reject a payment submission.');
    expect(() => assertSubmissionTransition(
      PaymentSubmissionStatus.SUBMITTED,
      PaymentSubmissionStatus.REJECTED,
      'Reference not found',
    )).not.toThrow();
  });

  it('does not allow a failed provider attempt to become successful', () => {
    expect(() => assertPaymentAttemptTransition(
      PaymentAttemptStatus.FAILED,
      PaymentAttemptStatus.SUCCESSFUL,
    )).toThrow(ConflictException);
  });
});
