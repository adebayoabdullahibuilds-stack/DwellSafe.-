import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { CorsOptions } from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);
  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const allowedOrigins = config.get<string[]>('FRONTEND_ORIGINS', []);

  app.use(helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        frameAncestors: ["'none'"],
      },
    } : false,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: nodeEnv === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
  }));

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  app.setGlobalPrefix('api');
  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
    credentials: true,
  };
  app.enableCors(corsOptions);
  app.use((request: Request, response: Response, next: NextFunction) => {
    const unsafeMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    const origin = request.get('origin');
    if (unsafeMethod && origin && !allowedOrigins.includes(origin)) {
      response.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Request origin is not allowed.',
        path: request.path,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('DwellSafe API')
      .setDescription('Marketplace foundation API. Listing and verification responses clearly identify fictional demo data.')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: 'api/docs-json',
    });
  }

  await app.listen(config.get<number>('PORT', 4000), '0.0.0.0');
}

void bootstrap();
