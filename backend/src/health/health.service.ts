import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class HealthService {
  private lastChecked = 0;
  private cachedDatabaseStatus: 'connected' | 'disconnected' = 'connected';
  private readonly cacheTtlMs = 15000;

  constructor(private readonly prisma: PrismaService) {}

  async getHealth(force = false) {
    const now = Date.now();
    if (force || now - this.lastChecked > this.cacheTtlMs) {
      try {
        await this.prisma.$queryRaw`SELECT 1`;
        this.cachedDatabaseStatus = 'connected';
      } catch {
        this.cachedDatabaseStatus = 'disconnected';
      }
      this.lastChecked = now;
    }

    return {
      status: this.cachedDatabaseStatus === 'connected' ? 'ok' : 'degraded',
      service: 'dwellsafe-backend',
      timestamp: new Date().toISOString(),
      database: { status: this.cachedDatabaseStatus },
    };
  }
}
