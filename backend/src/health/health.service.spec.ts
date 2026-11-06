import { PrismaService } from '../database/prisma.service';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('reports the database as connected when the query succeeds', async () => {
    const prisma = { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) } as unknown as PrismaService;
    const result = await new HealthService(prisma).getHealth();

    expect(result.status).toBe('ok');
    expect(result.database.status).toBe('connected');
  });

  it('reports a degraded status when the database query fails', async () => {
    const prisma = { $queryRaw: jest.fn().mockRejectedValue(new Error('database unavailable')) } as unknown as PrismaService;
    const result = await new HealthService(prisma).getHealth();

    expect(result.status).toBe('degraded');
    expect(result.database.status).toBe('disconnected');
  });
});
