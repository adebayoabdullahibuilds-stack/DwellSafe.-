import { Injectable } from '@nestjs/common';
import { DemoListingsProvider } from './demo-listings.provider';

@Injectable()
export class ListingsService {
  constructor(private readonly demoListings: DemoListingsProvider) {}

  getListings() {
    return this.demoListings.listings;
  }
}
