import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { PrismaService } from '../src/database/prisma.service';

describe('DwellSafe API endpoints', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue({
        $queryRaw: jest.fn().mockResolvedValue([{ result: 1 }]),
        $disconnect: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('returns application and database health', async () => {
    const response = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(response.body).toEqual(expect.objectContaining({
      status: 'ok',
      service: 'dwellsafe-backend',
      database: { status: 'connected' },
    }));
    expect(response.body.timestamp).toEqual(expect.any(String));
  });

  it('preserves the demo listings API response structure', async () => {
    const response = await request(app.getHttpServer()).get('/api/listings').expect(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toEqual(expect.objectContaining({
      id: 'LS-1001',
      status: 'Demo listing — not verified',
      available: true,
    }));
  });

  it('distinguishes demo counts from production verification decisions', async () => {
    const response = await request(app.getHttpServer()).get('/api/verification-status').expect(200);
    expect(response.body).toEqual(expect.objectContaining({
      totalListings: 3,
      verified: 0,
      pending: 0,
      demo: 3,
      dataSource: 'demo-provider',
      productionVerification: expect.objectContaining({ status: 'not_implemented' }),
    }));
  });
});
