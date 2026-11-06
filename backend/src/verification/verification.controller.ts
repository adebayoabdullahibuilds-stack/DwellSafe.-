import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';

@ApiTags('verification')
@Controller('verification-status')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get explicitly demo-only verification counts' })
  @ApiResponse({
    status: 200,
    description: 'Preserves the original counts and explicitly states that no production decisions are implemented.',
    schema: {
      example: {
        totalListings: 3,
        verified: 0,
        pending: 0,
        demo: 3,
        note: 'All API listings are fictional demonstration data and have not been verified.',
        lastUpdated: '2026-01-01T00:00:00.000Z',
        dataSource: 'demo-provider',
        productionVerification: {
          status: 'not_implemented',
          note: 'No production verification decisions are available from this endpoint.',
        },
      },
    },
  })
  getVerificationStatus() {
    return this.verificationService.getVerificationStatus();
  }
}
