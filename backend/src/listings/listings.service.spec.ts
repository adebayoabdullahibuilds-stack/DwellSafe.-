import { DemoListingsProvider } from './demo-listings.provider';
import { ListingsService } from './listings.service';

describe('ListingsService', () => {
  it('returns the legacy listing response shape from the explicit demo provider', () => {
    const service = new ListingsService(new DemoListingsProvider());
    const listings = service.getListings();

    expect(listings).toHaveLength(3);
    expect(listings[0]).toEqual({
      id: 'LS-1001',
      title: '2-bedroom apartment in Lekki Phase 1',
      location: 'Lekki Phase 1, Lagos',
      price: 'N8,500,000 / year',
      status: 'Demo listing — not verified',
      landlord: 'Adebisi O.',
      agent: 'BrightHomes Realty',
      bedrooms: 2,
      bathrooms: 2,
      available: true,
    });
    expect(listings.every((listing) => listing.status.includes('Demo'))).toBe(true);
  });
});
