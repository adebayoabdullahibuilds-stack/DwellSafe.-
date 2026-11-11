import { UserRole } from '@prisma/client';
import {
  canAccessObligation,
  canAccessTransaction,
} from './payment-access.service';

describe('payment object authorization', () => {
  const transaction = {
    propertyId: 'property-1',
    tenantId: 'tenant-1',
    landlordId: 'landlord-1',
    primaryAgentId: null,
  };

  it('allows only transaction parties or an authorized property agent', () => {
    expect(canAccessTransaction(
      { userId: 'tenant-1', roles: [UserRole.TENANT] },
      transaction,
      false,
    )).toBe(true);
    expect(canAccessTransaction(
      { userId: 'landlord-1', roles: [UserRole.LANDLORD] },
      transaction,
      false,
    )).toBe(true);
    expect(canAccessTransaction(
      { userId: 'agent-1', roles: [UserRole.AGENT] },
      transaction,
      true,
    )).toBe(true);
    expect(canAccessTransaction(
      { userId: 'outsider', roles: [UserRole.AGENT] },
      transaction,
      false,
    )).toBe(false);
  });

  it('limits rental obligations to the tenant and named beneficiary', () => {
    expect(canAccessObligation(
      { userId: 'tenant-1', roles: [UserRole.TENANT] },
      { tenantId: 'tenant-1' },
      'landlord-1',
    )).toBe(true);
    expect(canAccessObligation(
      { userId: 'agent-1', roles: [UserRole.AGENT] },
      { tenantId: 'tenant-1' },
      'agent-1',
    )).toBe(true);
    expect(canAccessObligation(
      { userId: 'agent-1', roles: [UserRole.AGENT] },
      { tenantId: 'tenant-1' },
      'landlord-1',
    )).toBe(false);
  });
});
