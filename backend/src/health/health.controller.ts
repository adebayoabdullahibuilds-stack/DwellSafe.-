import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check API and PostgreSQL connectivity' })
  @ApiResponse({
    status: 200,
    description: 'API responds even if the database is disconnected; inspect status and database.status.',
    schema: {
      example: {
        status: 'ok',
        service: 'dwellsafe-backend',
        timestamp: '2026-01-01T00:00:00.000Z',
        database: { status: 'connected' },
      },
    },
  })
  getHealth() {
    return this.healthService.getHealth();
  }
}
