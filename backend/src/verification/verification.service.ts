import { Injectable } from '@nestjs/common';
import { DemoListingsProvider } from '../listings/demo-listings.provider';

@Injectable()
export class VerificationService {
  constructor(private readonly demoListings: DemoListingsProvider) {}

  getVerificationStatus() {
    const total = this.demoListings.listings.length;
    return {
      totalListings: total,
      verified: 0,
      pending: 0,
      demo: total,
      note: 'All API listings are fictional demonstration data and have not been verified.',
      lastUpdated: new Date().toISOString(),
      dataSource: 'demo-provider',
      productionVerification: {
        status: 'not_implemented',
        note: 'No production verification decisions are available from this endpoint.',
      },
    };
  }
}
