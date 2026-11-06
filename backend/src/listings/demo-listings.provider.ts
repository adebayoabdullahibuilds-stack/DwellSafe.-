import { Injectable } from '@nestjs/common';

export type DemoListing = {
  id: string;
  title: string;
  location: string;
  price: string;
  status: string;
  landlord: string;
  agent: string;
  bedrooms: number;
  bathrooms: number;
  available: boolean;
};

@Injectable()
export class DemoListingsProvider {
  readonly listings: DemoListing[] = [
    {
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
    },
    {
      id: 'LS-1002',
      title: 'Studio flat near Yaba Tech',
      location: 'Yaba, Lagos',
      price: 'N4,200,000 / year',
      status: 'Demo listing — not verified',
      landlord: 'Chidi M.',
      agent: 'Urban Nest Agents',
      bedrooms: 1,
      bathrooms: 1,
      available: true,
    },
    {
      id: 'LS-1003',
      title: '3-bedroom duplex in Gwarinpa',
      location: 'Gwarinpa, Abuja',
      price: 'N12,000,000 / year',
      status: 'Demo listing — not verified',
      landlord: 'Fatima A.',
      agent: 'Prime Property Co.',
      bedrooms: 3,
      bathrooms: 3,
      available: false,
    },
  ];
}
