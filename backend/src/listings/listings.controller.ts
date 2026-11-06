import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListingsService } from './listings.service';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve fictional demonstration listings' })
  @ApiResponse({
    status: 200,
    description: 'Array of demo listings; IDs and listing details do not represent real properties.',
    schema: {
      example: [{
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
      }],
    },
  })
  getListings() {
    return this.listingsService.getListings();
  }
}
